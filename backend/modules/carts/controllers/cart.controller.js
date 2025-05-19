import db from "../../../config/database.config.js";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";

const Product = db.model.Product;

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    //add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find((item) => item.id === product.id);
      return { ...product.toJSON(), quantity: item.quantity };
    });
    successResponse(
      201,
      "SUCCESS",
      {
        cartItems,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while getting the cart item product",
      res
    );
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    successResponse(200, "SUCCESS", { cartItems: user.cartItems }, res);
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while adding the item to cart",
      res
    );
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    successResponse(200, "SUCCESS", { cartItems: user.cartItems }, res);
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while removing the item from cart",
      res
    );
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        successResponse(200, "SUCCESS", { cartItems: user.cartItems }, res);
      }
      existingItem.quantity = quantity;
      await user.save();
      successResponse(200, "SUCCESS", { cartItems: user.cartItems }, res);
    } else {
      errorHandler(500, "ERROR", err.message || "Product not found.", res);
    }
  } catch (err) {
    errorHandler(
      500,
      "ERROR",
      err.message || "Some error occurred while updating the quantity.",
      res
    );
  }
};
