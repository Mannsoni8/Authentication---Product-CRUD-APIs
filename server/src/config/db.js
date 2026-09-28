import mongoose from "mongoose";
import { config } from "./config.js";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Database connection already established, reusing...");
    return;
  }

  try {
    const db = await mongoose.connect(config.MONGO_URL);

    isConnected = db.connections[0].readyState === 1;

    console.log("Database is connected successfully");
  } catch (error) {
    console.error("Error in connecting database:", error);

    throw error;
  }
};
