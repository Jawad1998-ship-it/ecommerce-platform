const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for the ordered items (as a sub-document)
const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product", // Assumes you have a 'Product' model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Main Order Schema
const OrderSchema = new Schema(
  {
    // Billing Details from the form
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Town / City is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    orderNotes: {
      type: String,
      trim: true,
    },

    // Order Summary Details
    items: [OrderItemSchema],
    summary: {
      itemsSubtotal: { type: Number, required: true },
      shipping: { type: Number, required: true },
      tax: { type: Number, required: true },
    },
    grandTotal: {
      type: Number,
      required: true,
    },

    // Payment and Status
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["cod", "card"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // Optional user link for logged-in customers
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assumes you have a 'User' model
      required: false, // Not required for guest checkouts
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the model
// The third argument to mongoose.model is the collection name in the database
const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders");

module.exports = Order;
