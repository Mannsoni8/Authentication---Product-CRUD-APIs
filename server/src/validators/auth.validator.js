import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be in string")
    .trim(),

  body("email")
    .trim()
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter the valid email address"),

  body("password")
    .trim()
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be in String")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 char long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }
    next();
  },
];

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .isString()
    .withMessage("Email must be a String Value")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be in String")
    .bail()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be 6 char long"),

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
