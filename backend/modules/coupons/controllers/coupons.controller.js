import db from "../../../config/database.config.js";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";

const Coupon = db.model.Coupon;

export const createCoupon = async (userId) => {
  const coupon = await Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discount_percentage: 10,
    expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    user_id: userId,
  });
  await coupon.save();
  return coupon;
};

export const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.findOne({
      user_id: req.user._id,
      isActive: true,
    });
    successResponse(
      201,
      "SUCCESS",
      {
        coupons,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while getting the coupon",
      res
    );
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      user_id: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      errorResponse(404, "ERROR", "Coupon not found", res);
    }
    if (coupon.expiration_date < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      errorResponse(404, "ERROR", "Coupon expired", res);
    }
    successResponse(
      200,
      "SUCCESS",
      {
        message: "Coupon is valid",
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while validating the coupon",
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
