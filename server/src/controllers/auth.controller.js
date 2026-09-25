import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All field are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = createAccessToken({
      userId: user._id,
    });

    const refreshToken = createRefreshToken({
      userID: user._id,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All field are required",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid cedentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid cedentials",
      });
    }

    const accessToken = createAccessToken({
      userId: user._id,
    });

    const refreshToken = createRefreshToken({
      userID: user._id,
    });

    await userModel.findOneAndUpdate(
      {
        email,
      },
      {
        refreshToken,
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User logedIn successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookieStore.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token is not found",
      });
    }

    const decoded = readRefreshToken(refreshToken);

    const { userId } = decoded;

    const user = await userModel.findById(userId);

    if (refreshToken !== user.refreshToken) {
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });

      return res.status(401).json({
        message: "Missmatch refresh token",
      });
    }

    const accessToken = createAccessToken({ userId });

    const newRefreshToken = createRefreshToken({ userId });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
      newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "Token roated successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
      },
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
