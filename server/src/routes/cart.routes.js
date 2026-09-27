import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addToCartController } from "../controllers/cart.controller.js";

const router = Router();

router.post("/", authMiddleware, addToCartController);

export default router;
