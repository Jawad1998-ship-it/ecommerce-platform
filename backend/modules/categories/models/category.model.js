import mongoose from "mongoose";
const { Schema } = mongoose;

const AttributeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "number", "select"],
    required: true,
  },
  required: {
    type: Boolean,
    required: false,
  },
  options: {
    type: [String],
    required: function () {
      return this.type === "select";
    },
    validate: {
      validator: function (options) {
        return (
          this.type !== "select" ||
          (Array.isArray(options) && options.length > 0)
        );
      },
      message:
        "At least one option is required for attributes of type 'select'",
    },
    default: [],
  },
});

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiresApproval: {
      type: Boolean,
      required: false,
      default: true,
    },
    allowedUsers: {
      type: [String],
      validate: {
        validator: function (emails) {
          return emails.every((email) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          );
        },
        message: "All allowedUsers must be valid email addresses",
      },
      default: [],
    },
    attributes: {
      type: [AttributeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;
