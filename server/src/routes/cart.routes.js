import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addToCartController, getCartController } from "../controllers/cart.controller.js";

const router = Router();

router.post("/", authMiddleware, addToCartController);

router.get("/", authMiddleware, getCartController);

export default router;
