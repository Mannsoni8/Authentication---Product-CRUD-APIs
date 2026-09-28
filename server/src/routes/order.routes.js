import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  cancelOrderController,
  createOrderController,
  getOrderByIdController,
  updateOrderStatusController,
  getOrdersController,
} from "../controllers/order.controller.js";
import {
  orderIdValidator,
  orderStatusQueryValidator,
  updateOrderStatusValidator,
} from "../validators/order.validator.js";
import { adminMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrderController);

router.get("/", authMiddleware, orderStatusQueryValidator ,getOrdersController);

router.get("/:id", authMiddleware, orderIdValidator, getOrderByIdController);

router.patch(
  "/:id/cancel",
  authMiddleware,
  orderIdValidator,
  cancelOrderController,
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusValidator,
  updateOrderStatusController,
);

export default router;
