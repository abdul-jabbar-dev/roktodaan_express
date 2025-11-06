import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ROUTER from "./router/router";
import GlobalError from "./error/Index";
import prisma from "./connection/db";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://roktodaan.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // যদি cookies বা auth headers ব্যবহার করো
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
