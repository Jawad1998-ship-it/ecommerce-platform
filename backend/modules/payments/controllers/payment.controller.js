import db from "../../../config/database.config.js";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";
import Coupon from "../../coupons/models/coupons.model.js";
import { stripe } from "../../../lib/stripe.js";
import { createStripeCoupon } from "../../../lib/createStripeCoupon.js";
import { createCoupon } from "../../coupons/controllers/coupons.controller.js";

const Payment = db.model.Payment;

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); //converting to cents
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
      };
    });
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        user_id: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discount_percentage) / 100
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_APP_FRONTEND}/success?session_id=${session}`,
      cancel_url: `${process.env.NEXT_APP_FRONTEND}/cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discount_percentage),
            },
          ]
        : [],
      metadata: {
        user_id: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });
    if (totalAmount >= 20000) {
      await createCoupon(req.user._id);
    }
    successResponse(
      200,
      "SUCCESS",
      {
        id: session.id,
        totalAmount: totalAmount / 100,
      },
      res
    );
  } catch (error) {
    errorResponse(500, "ERROR", "Error processing checkout", res);
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            user_id: session.metadata.user_id,
          },
          {
            isActive: false,
          }
        );
      }
      const products = JSON.parse(session.metadata.products);
      const payment = new Payment({
        user: session.metadata.user_id,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, //convert from cents to dollars
        stripeSessionId: sessionId,
      });
      await payment.save();
      successResponse(
        200,
        "SUCCESS",
        {
          message: "Payment successful, order created.",
          order_id: payment._id,
        },
        res
      );
    }
  } catch (error) {
    errorResponse(500, "ERROR", "Error processing successful checkout", res);
  }
};
