import mongoose from "mongoose";

// Define your schema
const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount_percentage: { type: Number, required: true, min: 0, max: 100 },
    expiration_date: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    collection: "coupons",
    timestamps: true,
  }
);

// Create and export the model
const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
