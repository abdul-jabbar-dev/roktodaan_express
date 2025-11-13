import { RequestHandler } from "express";
import USER_SERVICE from "../app/user/user.service";

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; 
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
    const isBlacklisted = await USER_SERVICE.checkBlacklistToken(token);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token is blacklisted" });
    }   
    req.token = token;
    next(); 
  } catch (err: any) {
    console.error("Token verification error:", err);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};
