import { Router } from "express";
import { verifyToken } from "../../middleware/verify_token";
import REQUEST_CONTROL from "./request.control";

const requestRoute = Router();


requestRoute.post(
  "/publish",
  verifyToken,
  REQUEST_CONTROL.publishRequest
);

requestRoute.post(
  "/appointment",
  verifyToken,
  REQUEST_CONTROL.appointmentRequest
);


requestRoute.get(
  "/get_requests", 
   REQUEST_CONTROL.getAllRequests
); 
requestRoute.get(
  "/request/:user_id", 
   REQUEST_CONTROL.getUpcommingRequest
); 
export default requestRoute;
