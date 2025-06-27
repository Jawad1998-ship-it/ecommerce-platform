import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
  {
    country_name: { type: String, required: true },
    shipping_rate: {
      type: Number,
      required: true,
      min: [0, "Shipping rate must be non-negative"],
    },
  },
  {
    collection: "countries",
    timestamps: true,
  }
);

const Country = mongoose.model("Country", CountrySchema);
export default Country;
