import express from "express";
import * as PaymentController from "../controllers/payment.controller.js";
import { protectedRoute } from "../../../middlewares/authJwt.js";

const PaymentRouter = express.Router();

PaymentRouter.post(
  "/create-checkout-session",
  protectedRoute,
  PaymentController.createCheckoutSession
);
PaymentRouter.post(
  "/checkout-success",
  protectedRoute,
  PaymentController.checkoutSuccess
);

export default (app) => {
  app.use("/api/payments", PaymentRouter);
};
