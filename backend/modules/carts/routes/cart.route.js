import express from "express";
import * as CartController from "../controllers/cart.controller.js";
import { protectedRoute } from "../../../middlewares/authJwt.js";

const cartRouter = express.Router();

cartRouter.get("/", protectedRoute, CartController.getCartProducts);
cartRouter.post("/", protectedRoute, CartController.addToCart);
cartRouter.delete("/", protectedRoute, CartController.removeAllFromCart);
cartRouter.put("/:id", protectedRoute, CartController.updateQuantity);

export default (app) => {
  app.use("/api/carts", cartRouter);
};
