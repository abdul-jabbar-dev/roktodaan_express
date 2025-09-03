import express, { Router } from "express";
import userRouter from "../app/user/user.router";

const ROUTER: Router = express.Router();

ROUTER.use("/user", userRouter);

export default ROUTER;
