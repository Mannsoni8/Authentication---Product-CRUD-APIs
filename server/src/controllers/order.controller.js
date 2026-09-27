import mongoose from "mongoose";
import cartModel from "../models/cart.model";
import orderModel from "../models/order.model";
import productModel from "../models/product.model";

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
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find({
          user: req.user.userId,
        })
        .populate("items.product")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      orderModel.countDocuments({
        user: req.user.userId,
      }),
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
  try {
    const { id } = req.params;

    const order = await orderModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";

    await order.save();

    for (const item of order.items) {
      await productModel.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    await order.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Erron in cancleing order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await orderModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled order cannot be updated",
      });
    }

    order.status = status;

    await order.save();

    await order.populate("items.product");

    return res.status(200).json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Erron in updating status of order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
