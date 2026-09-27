import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeFromCartController,
  updateItemCartController,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", authMiddleware, addToCartController);

router.get("/", authMiddleware, getCartController);

router.put("/", authMiddleware, updateItemCartController);

router.delete("/", authMiddleware, removeFromCartController);

router.delete("/clear", authMiddleware, clearCartController);

export default router;
