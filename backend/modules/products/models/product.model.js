import mongoose from "mongoose";

// Define your schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

// Create and export the model
const Product = mongoose.model("Product", ProductSchema);
export default Product;
