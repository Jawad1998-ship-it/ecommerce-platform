import express from "express";
import * as userController from "../controllers/user.controller.js";
import userPhotoUploadMulter from "../../../middlewares/uploadUserPhoto.js";
import { protectedRoute, verifyToken } from "../../../middlewares/authJwt.js";

const userRouter = express.Router();

userRouter.get("/all-users", verifyToken, userController.findAll);
userRouter.get("/user/:id", verifyToken, userController.findOne);
userRouter.put("/user/:id", protectedRoute, userController.updateProfile);
userRouter.put(
  "/user/:id/password",
  verifyToken,
  userController.updatePassword
);
userRouter.delete("/user/:id", verifyToken, userController.deleteOne);
userRouter.post(
  "/user/upload-image",
  userPhotoUploadMulter,
  userController.uploadImage
);
export default (app) => {
  app.use("/api/users", userRouter);
};
