/**
 * Vercel Serverless Function Entry Point
 *
 * WHAT: This file exports the Express app as a serverless function handler.
 * Vercel looks for files in the /api directory and treats them as serverless functions.
 *
 * WHY: Traditional Node.js servers use `app.listen()` to keep a process running indefinitely.
 * Vercel's serverless platform spins up functions on-demand per request and shuts them down after.
 * We need to export the app instance directly instead of calling `app.listen()`.
 *
 * HOW IT WORKS:
 * 1. Vercel receives an HTTP request (e.g., GET /api/products)
 * 2. Vercel spins up this function and passes the request to it
 * 3. Our Express app handles the request through its routes and middleware
 * 4. The response is sent back to the client
 * 5. After a period of inactivity, Vercel shuts down the function (cold start on next request)
 *
 * FOR WHAT: This allows our Express backend to run on Vercel's serverless infrastructure
 * without modification to the core app logic.
 */

import app from "../src/app/app.js";
import { connectDB } from "../src/config/db.js";

/**
 * Ensure database connection is established before handling any requests.
 *
 * WHY: Since functions can be spun up at any time, we need to ensure
 * MongoDB is connected before processing the incoming request.
 *
 * The `await` at the top level works because this file is treated as an ES module.
 * The connection caching in connectDB() ensures we don't create duplicate connections.
 */
await connectDB();

/**
 * Export the Express app as the default export.
 *
 * WHAT: Vercel will use this exported app to handle all incoming HTTP requests.
 *
 * WHY: This is the standard pattern for Vercel serverless functions.
 * Instead of `export default (req, res) => {...}`, we export the entire Express app,
 * and Vercel's runtime wraps it automatically.
 */
export default app;
