import { createAccessToken, readAccessToken } from "../utils/auth.utils";

const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(400).json({
        message: "Access token is not found in the request header",
      });
    }

    const decoded = readAccessToken(accessToken);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
