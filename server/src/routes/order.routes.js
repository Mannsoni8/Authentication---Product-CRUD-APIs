import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  cancelOrderController,
  createOrderController,
  getOrderByIdControl,
  updateOrderStatusControllerler,
  getOrdersController,
} from "../controllers/order.controller";
import {
  orderIdValidator,
  updateOrderStatusValidator,
} from "../validators/order.validator";

const router = express.Router();

router.post("/", authMiddleware, createOrderController);

router.get("/", authMiddleware, getOrdersController);

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
  updateOrderStatusValidator,
  updateOrderStatusController,
);

export default router;
