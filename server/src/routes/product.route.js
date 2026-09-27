import express from "express";

import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createProductValidator,
  productIdValidator,
  updateProductValidator,
} from "../validators/product.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createProductValidator,
  createProductController,
);

router.get("/", getProductsController);

router.get("/:id", productIdValidator, getProductByIdController);

router.put(
  "/:id",
  authMiddleware,
  updateProductValidator,
  updateProductController,
);

router.delete(
  "/:id",
  authMiddleware,
  productIdValidator,
  deleteProductController,
);

export default router;
