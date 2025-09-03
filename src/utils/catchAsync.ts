import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync =
  (cb: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await cb(req, res, next);
    } catch (error) { 
      next(error);
    }
  };
export default catchAsync;
