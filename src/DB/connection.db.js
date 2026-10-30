import mongoose from "mongoose";
import { DB_URI } from "../config/config.js";
import { connectRedis } from "./redis.connection.js";

export async function dbConnection() {
  try {
    await mongoose.connect(DB_URI);
    await connectRedis();
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Connection Failed");
    console.log(err);
  }
}
