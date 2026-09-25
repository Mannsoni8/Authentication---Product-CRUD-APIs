import mongoose from "mongoose";
import { config } from "./config.js";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Database is connected");
  } catch (error) {
    console.log("Error in connecting database", error);
  }
};
