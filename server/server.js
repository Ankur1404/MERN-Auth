import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
const PORT = process.env.PORT || 4000;
connectDB();
const allowedOrigins =process.env.NODE_ENV === "production"
  ? [process.env.PRODUCTION_FRONTEND_URL]
  : [process.env.FRONTEND_URL];
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:allowedOrigins,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello, code!");
}); 

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});