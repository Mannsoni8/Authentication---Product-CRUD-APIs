import express from "express";
import app from "./src/app/app.js";
import { connectDB } from "./src/config/db.js";

await connectDB();

export default app;