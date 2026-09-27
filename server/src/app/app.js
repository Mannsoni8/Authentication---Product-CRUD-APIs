import express from "express";
import authRoutes from "../routes/auth.routes.js";
import cookieParser from "cookie-parser";
import productRoutes from "../routes/product.route.js";
import cartRoutes from "../routes/cart.routes.js"
import { errorMiddleware } from "../middleware/error.middleware.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes)

app.use((req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

export default app;
