import cartModel from "../models/cart.model";
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
    await cart.populate("items.products");

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
