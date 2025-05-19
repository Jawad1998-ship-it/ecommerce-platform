import express from "express";
import * as productController from "../controllers/product.controller.js";
import userPhotoUploadMulter from "../../../middlewares/uploadUserPhoto.js";
import {
  adminRoute,
  protectedRoute,
  verifyToken,
} from "../../../middlewares/authJwt.js";

const productRouter = express.Router();

productRouter.post(
  "/create",
  protectedRoute,
  adminRoute,
  productController.createProduct
);
productRouter.get(
  "/all-products",
  protectedRoute,
  adminRoute,
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
  "/category/:category",
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
