import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { protectedRoute } from "../../../middlewares/authJwt.js";

const authRoute = express.Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.post("/logout", authController.logout);
authRoute.post("/refresh-token", authController.refreshToken);
authRoute.post("/verify-code", authController.verifyCode);
authRoute.post("/resend-code", authController.resendCode);
authRoute.get("/profile", protectedRoute, authController.getProfile);

export default (app) => {
  app.use("/api", authRoute);
};
