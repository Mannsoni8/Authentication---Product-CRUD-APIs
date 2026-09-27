import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export const addToCartController = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Produc not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    let cart = await cartModel.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await cartModel.create({
        user: req.user.userId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (product.stock < newQuantity) {
          return res.status(400).json({
            message: "Insufficient stock",
          });
        }
        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }
      await cart.save();
    }
    await cart.populate("items.product");

    return res.status(200).json({
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Erron in geting cart:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCartController = async (req, res) => {
  try {
    let cart = await cartModel
      .findOne({
        user: req.user.userId,
      })
      .populate("items.product");

    if (!cart) {
      cart = await cartModel.create({
        user: req.user.userId,
        items: [],
      });
    }

    return res.status(200).json({
      data: cart,
    });
  } catch (error) {
    console.error("Erron in geting user cart:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    const cart = await cartModel.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product is not in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate("items.product");

    return res.status(200).json({
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Erron in updating user cart:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
