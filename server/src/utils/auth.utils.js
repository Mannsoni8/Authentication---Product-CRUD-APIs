import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export function createAccessToken({ userID }) {
  const accessToken = jwt.sign(
    {
      userID,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  return accessToken;
}

export function createRefreshToken({ userID }) {
  const refreshToken = jwt.sign(
    {
      userID,
    },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return refreshToken;
}

export function readRefreshToken(req, res) {
  return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}
