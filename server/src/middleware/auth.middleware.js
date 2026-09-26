const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(400).json({
        message: "Access token is not found in the request header",
      });
    }
  } catch (error) {}
};
