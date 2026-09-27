import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export function createAccessToken({ userId }) {
  const accessToken = jwt.sign(
    {
      userId,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  return accessToken;
}

export function createRefreshToken({ userId }) {
  const refreshToken = jwt.sign(
    {
      userId,
    },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return refreshToken;
}

export function readRefreshToken(req, res) {
  return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}

export function readAccessToken(accessToken) {
  return jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
}
