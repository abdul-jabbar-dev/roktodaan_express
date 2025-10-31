import { RequestHandler } from "express";
import JWT from "../../lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export const getSessionStatus: RequestHandler = async (req, res, next) => {
  const { sessionName } = req.query;

  const token = req.cookies[sessionName as string]; 
  if (!token) return res.json({ status: false, error: "No session found" });

  try {
    const payload = JWT.DecToken(token) as JwtPayload;

    res.json({
      status: true,
      step: payload.step,
      otpStatus: payload.otpStatus,
    });
  } catch {
    res.json({ status: false, error: "Invalid session" });
  }
};
