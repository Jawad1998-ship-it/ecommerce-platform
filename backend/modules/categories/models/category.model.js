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
    required: true,
  },
});

const CategorySchema = new Schema(
  {
    cat_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    approval: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;
