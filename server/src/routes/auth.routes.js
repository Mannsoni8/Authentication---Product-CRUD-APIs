import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  loginUserController,
  registerUserController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerValidator, registerUserController);

router.post("/login", loginValidator, loginUserController);
export default router;
