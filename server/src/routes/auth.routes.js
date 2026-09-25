import express from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { registerUserController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerValidator, registerUserController);

export default router;
