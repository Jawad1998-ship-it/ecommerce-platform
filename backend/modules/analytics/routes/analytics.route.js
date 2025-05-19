import express from "express";
import * as AnalyticsController from "../controllers/analytics.controller.js";
import { adminRoute, protectedRoute } from "../../../middlewares/authJwt.js";

const AnalyticsRouter = express.Router();

AnalyticsRouter.get(
  "/",
  protectedRoute,
  adminRoute,
  AnalyticsController.getAnalytics
);
export default (app) => {
  app.use("/api/analytics", AnalyticsRouter);
};
