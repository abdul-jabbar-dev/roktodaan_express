import { Response } from "express";
import SendError from "../../types/error";

const SendErrorResponse = (res: Response, issue: any) => {
  const error: SendError = {
    status: false,
    error: issue,

  };
  res.send(error);
};
export default SendErrorResponse;

export const SendResponse = (res: Response, data: any) => {
  const result = {
    status: true,
    data,
  };
  res.send(result);
};
