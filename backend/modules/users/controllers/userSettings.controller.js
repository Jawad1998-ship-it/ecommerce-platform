import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { f_name, l_name, email } = req.body;

    // Validate required fields
    if (!f_name || !l_name || !email) {
      return errorResponse(
        400,
        "FAILED",
        "First name, last name, and email are required",
        res
      );
    }

    // Check if the user exists
    const user = await User.findById(id);
    console.log("this", user);

    if (!user) {
      return errorResponse(404, "FAILED", "User not found", res);
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return errorResponse(
          400,
          "FAILED",
          "Email is already taken by another user",
          res
        );
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { f_name, l_name, email },
      { new: true, runValidators: true }
    ).select("-password");
    console.log("this", updatedUser);
    successResponse(
      200,
      "SUCCESS",
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          f_name: updatedUser.f_name,
          l_name: updatedUser.l_name,
          email: updatedUser.email,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
        },
      },
      res
    );
  } catch (error) {
    errorResponse(
      500,
      "ERROR",
      error.message || "Failed to update profile",
      res
    );
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return errorResponse(
        400,
        "FAILED",
        "Current password and new password are required",
        res
      );
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return errorResponse(
        400,
        "FAILED",
        "New password must be at least 8 characters long",
        res
      );
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(404, "FAILED", "User not found", res);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return errorResponse(400, "FAILED", "Current password is incorrect", res);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.findByIdAndUpdate(
      id,
      { password: hashedNewPassword },
      { new: true }
    );

    successResponse(
      200,
      "SUCCESS",
      { message: "Password updated successfully" },
      res
    );
  } catch (error) {
    errorResponse(
      500,
      "ERROR",
      error.message || "Failed to update password",
      res
    );
  }
};
