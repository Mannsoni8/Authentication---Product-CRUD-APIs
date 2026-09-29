import app from "../src/app/app.js";
import { connectDB } from "../src/config/db.js";

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Serverless DB connection error:", error.message);
  }
  return app(req, res);
};
