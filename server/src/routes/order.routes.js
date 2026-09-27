import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createOrderController, getOrderByIdController, getOrdersController } from "../controllers/order.controller";

const router = express.Router()

router.post("/", authMiddleware, createOrderController);

router.get("/", authMiddleware, getOrdersController);

router.get("/:id", authMiddleware, getOrderByIdController);

export default router;