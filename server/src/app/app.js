import express from "express";
import authRoutes from "../routes/auth.routes.js";
import cookieParser from "cookie-parser";
import productRoutes from "../routes/product.route.js";
import cartRoutes from "../routes/cart.routes.js";
import orderRoutes from "../routes/order.routes.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Server is conected");
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

export default app;
