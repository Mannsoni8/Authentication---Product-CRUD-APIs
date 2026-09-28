import mongoose from "mongoose";
import { config } from "./config.js";
import { setServers } from "node:dns/promises";

// Set custom DNS servers for faster and more reliable DNS resolution
// This helps with MongoDB Atlas connectivity in some regions
setServers(["1.1.1.1", "8.8.8.8"]);

/**
 * Global variable to cache the database connection status.
 *
 * WHY: In serverless environments like Vercel, each HTTP request can spin up a new function instance.
 * Without caching, Mongoose would create a NEW connection on every single request, which:
 * 1. Wastes time (connection overhead ~100-500ms per request)
 * 2. Exhausts MongoDB Atlas connection limits quickly
 * 3. Causes "too many connections" errors under load
 *
 * By caching the connection, we reuse the existing connection across function invocations
 * in the same container, dramatically improving performance and reducing costs.
 */
let isConnected = false;

/**
 * Connects to MongoDB with connection caching for serverless optimization.
 *
 * WHAT: This function checks if we already have an active connection before
 * attempting to create a new one. If connected, it returns early.
 *
 * FOR WHAT: This is essential for Vercel serverless deployment where:
 * - Functions are stateless but containers are reused
 * - We want to avoid connection pool exhaustion
 * - We want faster cold start times on warm containers
 */
export const connectDB = async () => {
  // If already connected, reuse the existing connection
  // This prevents creating duplicate connections in serverless warm starts
  if (isConnected) {
    console.log("Database connection already established, reusing...");
    return;
  }

  try {
    // Attempt to establish a new MongoDB connection
    const db = await mongoose.connect(config.MONGO_URL);

    // Check if the connection is ready (readyState 1 means connected)
    isConnected = db.connections[0].readyState === 1;

    console.log("Database is connected successfully");
  } catch (error) {
    console.error("Error in connecting database:", error);

    // Re-throw the error so the calling code can handle it
    // This prevents the app from starting without a database connection
    throw error;
  }
};