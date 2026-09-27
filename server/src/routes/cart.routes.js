import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeFromCartController,
  updateItemCartController,
} from "../controllers/cart.controller.js";
import {
  addToCartValidator,
  removeFromCartValidator,
  updateCartValidator,
} from "../validators/cart.validator.js";

const router = Router();

router.post("/", authMiddleware, addToCartValidator, addToCartController);

router.get("/", authMiddleware, getCartController);

router.put("/", authMiddleware, updateCartValidator, updateItemCartController);

router.delete(
  "/",
  authMiddleware,
  removeFromCartValidator,
  removeFromCartController,
);

router.delete("/clear", authMiddleware, clearCartController);

export default router;
