import productModel from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Required product fields are missing",
      });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
