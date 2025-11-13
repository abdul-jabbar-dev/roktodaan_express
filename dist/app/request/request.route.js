"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_token_1 = require("../../middleware/verify_token");
const request_control_1 = __importDefault(require("./request.control"));
const requestRoute = (0, express_1.Router)();
requestRoute.post("/publish", verify_token_1.verifyToken, request_control_1.default.publishRequest);
requestRoute.post("/appointment", verify_token_1.verifyToken, request_control_1.default.appointmentRequest);
requestRoute.get("/get_requests", request_control_1.default.getAllRequests);
exports.default = requestRoute;
