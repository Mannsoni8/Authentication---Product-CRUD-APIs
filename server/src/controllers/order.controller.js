import productModel from "../models/product.model";

export const createOrderController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const productIds = cart.items.map((item) => item.product);

    const products = await productModel.find({
      _id: { $in: productIds },
    });

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = products.find(
        (item) => item._id.toString() === cartItem.product.toString(),
      );

      if (!product) {
        return res.status(404).json({
          message: "One or more products no longer exist",
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const itemTotal = product.price * cartItem.quantity;

      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: product.price,
      });

      totalAmount += itemTotal;
    }

    const order = await orderModel.create({
      user: userId,
      items: orderItems,
      totalAmount,
    });

    for (const cartItem of cart.items) {
      await productModel.findByIdAndUpdate(cartItem.product, {
        $inc: {
          stock: -cartItem.quantity,
        },
      });
    }

    cart.items = [];
    await cart.save();

    await order.populate("items.product");

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Erron in order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({
        user: req.user.userId,
      })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    console.error("Erron in geting order:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
