import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    collection: "carts",
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
