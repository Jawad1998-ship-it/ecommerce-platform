import mongoose from "mongoose";

// Define your schema
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

// Create and export the model
const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
