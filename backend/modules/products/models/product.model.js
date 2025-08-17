import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    category_name: {
      type: String,
      required: true,
    },
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
    attributes: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value) {
          if (value.size === 0) return false;
          for (const val of value.values()) {
            if (Array.isArray(val)) {
              return val.every((item) => typeof item === "string");
            }
            return typeof val === "string";
          }
          return true;
        },
        message:
          "Attributes must be a non-empty map with string or string array values",
      },
    },
    features: {
      type: [String],
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    isInStock: {
      type: Boolean,
      default: true,
    },
    cloudinaryPublicIds: {
      type: [String],
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
