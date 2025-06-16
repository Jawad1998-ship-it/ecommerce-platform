import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    compatibleDevices: {
      type: String,
      required: true,
    },
    screenSize: {
      type: String,
      required: true,
    },
    dimensions: {
      type: String,
      required: true,
    },
    batteryLife: {
      type: String,
    },
    sensorType: {
      type: String,
    },
    batteryDescription: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    isInStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
