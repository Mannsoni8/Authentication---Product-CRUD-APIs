import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
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
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user._id,
    });

    // Store only hashed refresh token in DB
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashRefreshToken(refreshToken),
    });

    // Store raw token only in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
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
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user._id,
    });

    // Store hashed refresh token
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashRefreshToken(refreshToken),
    });

    // Send raw refresh token to browser
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const decoded = readRefreshToken(refreshToken);
    const { userId } = decoded;

    const user = await userModel.findById(userId).select("+refreshToken");

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Compare hash of cookie token with hash stored in DB
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    if (hashedRefreshToken !== user.refreshToken) {
      // Possible token reuse -> invalidate stored token
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Create new access token
    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });

    // Rotate refresh token
    const newRefreshToken = createRefreshToken({
      userId: user._id,
    });

    // Store hash of NEW refresh token
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashRefreshToken(newRefreshToken),
    });

    // Send new raw refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Token rotated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    const userId = req.user.userId;

    await userModel.findByIdAndUpdate(userId, {
      $set: {
        refreshToken: null,
      },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in getting user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
