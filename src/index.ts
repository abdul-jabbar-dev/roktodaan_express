import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ROUTER from "./router/router";
import GlobalError from "./error/Index";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use("/api", ROUTER);

app.use(GlobalError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
