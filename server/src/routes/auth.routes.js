import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  loginUserController,
  registerUserController,
  refreshTokenController,
  logoutUserController,
  getMeController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerUserController);

router.post("/login", loginValidator, loginUserController);

router.post("/refresh-token", refreshTokenController);

router.post("/logout", authMiddleware, logoutUserController);

router.get("/me", authMiddleware, getMeController);

export default router;
