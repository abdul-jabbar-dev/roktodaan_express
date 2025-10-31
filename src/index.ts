import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ROUTER from "./router/router";
import GlobalError from "./error/Index";
import prisma from "./connection/db";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", ROUTER);

app.use(GlobalError);

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
