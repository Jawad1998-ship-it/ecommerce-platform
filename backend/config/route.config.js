import Analytics from "../modules/analytics/routes/analytics.route.js";
import authRoute from "../modules/auth/routes/auth.route.js";
import cartRoute from "../modules/carts/routes/cart.route.js";
import categoryRoute from "../modules/categories/routes/category.route.js";
import couponsRoute from "../modules/coupons/routes/coupons.route.js";
import paymentRoute from "../modules/payments/routes/payment.route.js";
import productRoute from "../modules/products/routes/product.route.js";
import userRoutes from "../modules/users/routes/user.route.js";

const configureRoutes = (app) => {
  userRoutes(app);
  authRoute(app);
  productRoute(app);
  cartRoute(app);
  couponsRoute(app);
  paymentRoute(app);
  Analytics(app);
  categoryRoute(app);
};

export default configureRoutes;
