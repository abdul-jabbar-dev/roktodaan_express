import express, { Router } from "express";
import userRouter from "../app/user/user.router";
import mediaRoute from "../app/media/media.route";

const ROUTER: Router = express.Router();

ROUTER.use("/user", userRouter);
ROUTER.use("/media",mediaRoute);

export default ROUTER;
