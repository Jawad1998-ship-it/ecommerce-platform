import express from "express";
import * as productController from "../controllers/product.controller.js";
import userPhotoUploadMulter from "../../../middlewares/uploadUserPhoto.js";
import {
  adminRoute,
  companyRoute,
  protectedRoute,
  verifyToken,
} from "../../../middlewares/authJwt.js";

const productRouter = express.Router();

productRouter.post(
  "/create",
  protectedRoute,
  companyRoute,
  productController.createProduct
);
productRouter.get(
  "/all-products",
  // protectedRoute,
  // companyRoute,
  productController.findAllProducts
);
productRouter.get(
  "/featured-products",
  productController.findAllFeaturedProducts
);
productRouter.get(
  "/recommendations",
  productController.findAllRecommendedProducts
);
productRouter.get(
  "/:category",
  verifyToken,
  productController.findProductsByCategory
);
productRouter.put(
  "/:id",
  protectedRoute,
  adminRoute,
  productController.toggleFeaturedProducts
);
productRouter.delete(
  "/:id",
  protectedRoute,
  adminRoute,
  productController.deleteOne
);
productRouter.post(
  "/product/upload-image",
  userPhotoUploadMulter,
  productController.uploadImage
);
export default (app) => {
  app.use("/api/products", productRouter);
};
