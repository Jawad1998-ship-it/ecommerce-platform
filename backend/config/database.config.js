import dotenv from "dotenv";
import mongoose from "mongoose";
import models from "./model.config.js";
dotenv.config();
const db = {};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}`);
    console.log("Database Connected Successfully!!");
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  }
};

db.connectToDatabase = connectToDatabase;
db.mongoose = mongoose;
db.model = { ...models };
export default db;
