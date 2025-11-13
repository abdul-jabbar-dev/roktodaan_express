import express, { Router } from "express";
import userRouter from "../app/user/user.router";
import mediaRoute from "../app/media/media.route"; 
import requestRoute from "../app/request/request.route";

const ROUTER: Router = express.Router();

ROUTER.use("/user", userRouter);
ROUTER.use("/media",mediaRoute);
ROUTER.use("/request",requestRoute);


export default ROUTER;
