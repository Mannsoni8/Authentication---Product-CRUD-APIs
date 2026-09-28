import app from "./app/app.js";
import { config } from "./config/config.js";
import { connectDB } from "./config/db.js";

await connectDB();

export default app;

