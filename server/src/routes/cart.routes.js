import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { addToCartController } from "../controllers/cart.controller";

const router = Router();

router.post("/", authMiddleware, addToCartController);

export default router;
