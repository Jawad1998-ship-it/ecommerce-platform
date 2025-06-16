import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../config/database.config.js";
import errorResponse from "../utils/errorResponse.js";

dotenv.config();

const User = db.model.User;

// Token verification middleware
export const verifyToken = async (req, res, next) => {
  try {
    const authBearerToken = req?.headers?.authorization;

    if (!authBearerToken) {
      return res.status(401).send({
        error: "Unauthorised Access",
        message: "authBearerToken not found at verifyToken function",
      });
    }

    // Extract and verify the token
    const token = authBearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate token against the database
    const user = await User.findOne({
      where: {
        id: decoded.id,
        mobile_token: token,
      },
    });

    if (!user) {
      return res.status(403).send({
        error: "Forbidden Access",
        message: "Invalid token or user has been logged out",
      });
    }

    req.user = {
      ...decoded,
      token,
    };
    next();
  } catch (error) {
    errorResponse(
      500,
      "ERROR",
      error.message || "Some error occurred while Verifying Token",
      res
    );
  }
};

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({ message: "Unauthorized - Access token has expired" });
      }
      throw error;
    }
  } catch (error) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred in protected route",
      res
    );
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

export const companyRoute = (req, res, next) => {
  if (req.user && req.user.role === "company") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Company only" });
  }
};
