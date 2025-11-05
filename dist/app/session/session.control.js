"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionStatus = void 0;
const jwt_1 = __importDefault(require("../../lib/jwt"));
const getSessionStatus = async (req, res, next) => {
    const { sessionName } = req.query;
    const token = req.cookies[sessionName];
    if (!token)
        return res.json({ status: false, error: "No session found" });
    try {
        const payload = jwt_1.default.DecToken(token);
        res.json({
            status: true,
            step: payload.step,
            otpStatus: payload.otpStatus,
        });
    }
    catch {
        res.json({ status: false, error: "Invalid session" });
    }
};
exports.getSessionStatus = getSessionStatus;
