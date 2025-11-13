import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
 import { SendResponse } from "../../schema/Response/response";
import { REQUEST_SERVICE } from "./request.service";

const publishRequest: RequestHandler = catchAsync(async (req, res, next) => {
  if (!req.token) {
    return next({
      message: "Authentication Failed. Please login first.",
      field: "Auth Token Missing",
    });
  } 
  const result = await REQUEST_SERVICE.publishRequest(req.body, req.token);
  SendResponse(res, result);
});
const getAllRequests: RequestHandler = catchAsync(async (req, res, next) => {
 
  const result = await REQUEST_SERVICE.getAllRequests();
  SendResponse(res, result);
});

const appointmentRequest: RequestHandler = catchAsync(async (req, res, next) => {
  
  const result = await REQUEST_SERVICE.appointmentRequest(req.body);
  SendResponse(res, result);
});

const REQUEST_CONTROL = { publishRequest, getAllRequests,appointmentRequest };
export default REQUEST_CONTROL;
