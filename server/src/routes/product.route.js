import express from "express";

import {
  createProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProductController);

router.get("/", getProductsController);

router.get("/:id", getProductByIdController);

router.put("/:id", authMiddleware, updateProductController);

export default router;
