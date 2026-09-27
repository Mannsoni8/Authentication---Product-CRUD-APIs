import { body, validationResult } from "express-validator";

export const addToCartValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
     (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: "Invalid data",
            errors: errors.array(),
          });
        }
        next();
      },
];

export const updateCartValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
     (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: "Invalid data",
            errors: errors.array(),
          });
        }
        next();
      },
];

export const removeFromCartValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),
     (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: "Invalid data",
            errors: errors.array(),
          });
        }
        next();
      },
];