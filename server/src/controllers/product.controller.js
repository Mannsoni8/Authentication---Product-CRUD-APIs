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

export const getProductsController = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1));

    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      productModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

      productModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      data: products,
      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
