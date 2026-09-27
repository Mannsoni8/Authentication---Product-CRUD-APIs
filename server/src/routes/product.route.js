import express from "express";

import {
  createProductController,
  deleteProductController,
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

router.delete("/:id", authMiddleware, deleteProductController);

export default router;
