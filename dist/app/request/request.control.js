"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const response_1 = require("../../schema/Response/response");
const request_service_1 = require("./request.service");
const publishRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.token) {
        return next({
            message: "Authentication Failed. Please login first.",
            field: "Auth Token Missing",
        });
    }
    const result = await request_service_1.REQUEST_SERVICE.publishRequest(req.body, req.token);
    (0, response_1.SendResponse)(res, result);
});
const getAllRequests = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await request_service_1.REQUEST_SERVICE.getAllRequests();
    (0, response_1.SendResponse)(res, result);
});
const appointmentRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await request_service_1.REQUEST_SERVICE.appointmentRequest(req.body);
    (0, response_1.SendResponse)(res, result);
});
const REQUEST_CONTROL = { publishRequest, getAllRequests, appointmentRequest };
exports.default = REQUEST_CONTROL;
