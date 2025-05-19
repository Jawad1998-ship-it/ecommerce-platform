import Cart from "../modules/carts/models/cart.model.js";
import Coupon from "../modules/coupons/models/coupons.model.js";
import Product from "../modules/products/models/product.model.js";
import User from "../modules/users/models/user.model.js";
import Payment from "../modules/payments/models/payment.model.js";
import Analytics from "../modules/analytics/models/analytics.model.js";

const models = {
  User,
  Product,
  Cart,
  Coupon,
  Payment,
  Analytics,
};

export default models;
