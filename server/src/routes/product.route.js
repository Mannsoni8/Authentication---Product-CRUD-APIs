import express from "express";

import {
  createProductController,
  getProductsController,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProductController);

router.get("/", getProductsController);

export default router;
