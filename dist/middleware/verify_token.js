"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const user_service_1 = __importDefault(require("../app/user/user.service"));
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("authHeader", authHeader);
        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication Failed. Login first.",
                field: "Auth Token Missing",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token malformed" });
        }
        // Check blacklist
        const isBlacklisted = await user_service_1.default.checkBlacklistToken(token);
        if (isBlacklisted) {
            return res.status(403).json({ message: "Token is blacklisted" });
        }
        // Attach user info to request
        req.token = token;
        next(); // allow request to proceed
    }
    catch (err) {
        console.error("Token verification error:", err);
        return res
            .status(401)
            .json({ message: "Invalid or expired token", error: err.message });
    }
};
exports.verifyToken = verifyToken;
