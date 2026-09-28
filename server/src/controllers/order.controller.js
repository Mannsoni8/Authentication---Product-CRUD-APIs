import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";

export const createOrderController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const cart = await cartModel
        .findOne({
          user: req.user.userId,
        })
        .session(session);

      if (!cart || cart.items.length === 0) {
        const error = new Error("Cart is empty");
        error.statusCode = 400;
        throw error;
      }

      const orderItems = [];
      let totalAmount = 0;

      for (const cartItem of cart.items) {
        const product = await productModel
          .findOne({
            _id: cartItem.product,
            stock: { $gte: cartItem.quantity },
          })
          .session(session);

        if (!product) {
          const error = new Error("Product not found or insufficient stock");
          error.statusCode = 400;
          throw error;
        }

        orderItems.push({
          product: product._id,
          quantity: cartItem.quantity,
          price: product.price,
        });

        totalAmount += product.price * cartItem.quantity;

        product.stock -= cartItem.quantity;
        await product.save({ session });
      }

      const [order] = await orderModel.create(
        [
          {
            user: req.user.userId,
            items: orderItems,
            totalAmount,
          },
        ],
        { session },
      );

      cart.items = [];
      await cart.save({ session });

      createdOrder = order;
    });

    await createdOrder.populate("items.product");

    return res.status(201).json({
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    console.error("Erron in creating order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    await session.endSession();
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {
      user: req.user.userId,
    };

    if (status) {
      filter.status = status;
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find(filter)
        .populate("items.product")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      orderModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      data: orders,
      pagination: {
        currentPage: page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Erron in geting order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel
      .findOne({
        _id: id,
        user: req.user.userId,
      })
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      data: order,
    });
  } catch (error) {
    console.error("Erron in geting order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const cancelOrderController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await orderModel
        .findOne({
          _id: req.params.id,
          user: req.user.userId,
        })
        .session(session);

      if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
      }

      if (!["pending", "confirmed"].includes(order.status)) {
        const error = new Error(
          "Order cannot be cancelled in its current status",
        );
        error.statusCode = 400;
        throw error;
      }

      for (const item of order.items) {
        await productModel.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          },
          { session },
        );
      }

      order.status = "cancelled";

      await order.save({ session });

      cancelledOrder = order;
    });

    await cancelledOrder.populate("items.product");

    return res.status(200).json({
      message: "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (error) {
    console.error("Erron in canceling the order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    await session.endSession();
  }
};

export const updateOrderStatusController = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let updatedOrder;

    await session.withTransaction(async () => {
      const order = await orderModel.findById(req.params.id).session(session);

      if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
      }

      const allowedTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
      };

      if (!allowedTransitions[order.status].includes(req.body.status)) {
        const error = new Error(
          `Cannot change order status from ${order.status} to ${req.body.status}`,
        );
        error.statusCode = 400;
        throw error;
      }

      order.status = req.body.status;

      await order.save({ session });

      updatedOrder = order;
    });

    await updatedOrder.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Erron in updating status of order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    await session.endSession();
  }
};
