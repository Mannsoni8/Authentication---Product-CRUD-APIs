import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not provided");
}
if (!process.env.PORT) {
  throw new Error("PORT is not provided");
}

export const config = {
  MONGO_URL: process.env.MONGO_URI,
  PORT: process.env.PORT,
};
