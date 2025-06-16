import express from "express";
import * as categoryController from "../controllers/category.controller.js";

import {
  adminRoute,
  companyRoute,
  protectedRoute,
  verifyToken,
} from "../../../middlewares/authJwt.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/create",
  protectedRoute,
  companyRoute,
  categoryController.createProduct
);
categoryRouter.get(
  "/all-categories",
  protectedRoute,
  adminRoute,
  categoryController.findAllProducts
);
categoryRouter.get(
  "/:category",
  verifyToken,
  categoryController.findProductsByCategory
);
categoryRouter.put(
  "/:id",
  protectedRoute,
  adminRoute,
  categoryController.toggleFeaturedProducts
);
categoryRouter.delete(
  "/:id",
  protectedRoute,
  adminRoute,
  categoryController.deleteOne
);
export default (app) => {
  app.use("/api/categories", categoryRouter);
};
