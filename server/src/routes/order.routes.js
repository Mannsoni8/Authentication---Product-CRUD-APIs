import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createOrderController } from "../controllers/order.controller";

const router = express.Router()
router.post("/", authMiddleware, createOrderController);

export default router;