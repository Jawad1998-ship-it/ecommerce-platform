import dotenv from "dotenv";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";
import bcrypt from "bcryptjs";
import db from "../../../config/database.config.js";
import { redis } from "../../../lib/redis.js";
import generateToken from "../../../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../../utils/sendEmail.js";
dotenv.config();
const User = db.model.User;

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  try {
    const userData = req.body;
    if (
      !userData.f_name ||
      !userData.l_name ||
      !userData.email ||
      !userData.password
    ) {
      return errorResponse(
        400,
        "FAILED",
        "First name, last name, email, and password are required",
        res
      );
    }

    // check if user already exists by email
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return errorResponse(
        400,
        "FAILED",
        "User already exists with this email",
        res
      );
    }
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // construct the user object
    const newUser = new User({
      f_name: userData.f_name,
      l_name: userData.l_name,
      email: userData.email,
      password: hashedPassword,
      cartItems: userData.cartItems || [],
      role: userData.role,
    });

    // save the user to the database
    await newUser.save();
    await sendVerificationEmail(newUser?.email);

    successResponse(
      201,
      "SUCCESS",
      {
        user: {
          id: newUser._id,
          f_name: newUser.f_name,
          l_name: newUser.l_name,
          email: newUser.email,
          cartItems: newUser.cartItems,
          role: newUser.role,
          isVerified: newUser.isVerified,
        },
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while creating the user",
      res
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(
        user._id,
        user?.role,
        user?.isVerified
      );
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);
      successResponse(
        200,
        "SUCCESS",
        {
          user: {
            id: user._id,
            f_name: user.f_name,
            l_name: user.l_name,
            email: user.email,
            cartItems: user.cartItems,
            role: user.role,
            isVerified: user.isVerified,
          },
        },
        res
      );
    } else {
      return errorResponse(401, "FAILED", "Invalid email or password", res);
    }
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while logging in the User.",
      res
    );
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  // console.log("this", req.body);
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }
  try {
    const user = await User.findOne({ email });

    // Get the stored code from Redis
    const storedCode = await redis.get(email);

    if (!storedCode || storedCode !== code) {
      return res
        .status(400)
        .json({ error: "Invalid or expired code, try resending" });
    }

    user.isVerified = true;
    await user.save();
    const { accessToken, refreshToken } = generateToken(
      user?._id,
      user?.role,
      user?.isVerified
    );
    await storeRefreshToken(user?._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    //remove the verification code from redis after successful verification
    await redis.del(email);
    successResponse(
      200,
      "SUCCESS",
      {
        user: {
          id: user._id,
          f_name: user.f_name,
          l_name: user.l_name,
          email: user.email,
          cartItems: user.cartItems,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      res
    );
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
};

export const resendCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email not specified try registering again!" });
  }
  try {
    await sendVerificationEmail(email);
    successResponse(
      200,
      "SUCCESS",
      "Verification code resent successfully",
      res
    );
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
};

export const getProfile = async (req, res) => {
  try {
    successResponse(
      200,
      "SUCCESS",
      {
        userInfo: req.user,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Error getting profile info",
      res
    );
  }
};
