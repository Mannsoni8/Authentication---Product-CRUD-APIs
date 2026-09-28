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
import { adminMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProductValidator,
  createProductController,
);

router.get("/", getProductsController);

router.get("/:id", productIdValidator, getProductByIdController);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProductValidator,
  updateProductController,
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productIdValidator,
  deleteProductController,
);

export default router;
