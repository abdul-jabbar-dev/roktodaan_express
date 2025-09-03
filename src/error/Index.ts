import { ErrorRequestHandler } from "express";
import { BaseIssue } from "valibot";
import { SendFiledError } from "../types/error";
import SendErrorResponse from "../schema/Response/response";
import { CUSTOM_VALIBOT, VALIBOT } from "../constant/error_cont";

const GlobalError: ErrorRequestHandler = (error, req, res, next) => {
  if (error?.from === CUSTOM_VALIBOT) {
    const errors: SendFiledError[] = [
      {
        message: "Phone Number Already Exist!",
        field: "phoneNumber",
      },
    ];
    return SendErrorResponse(res, { name: "Duplication Error", errors });
  }
  if (error?.from === VALIBOT) {
    const issues = error?.errors?.issues as BaseIssue<any>[];

    const errors: SendFiledError[] = issues.map((issue) => ({
      field: issue.path?.reverse()[0].key as string,
      path: issue.path?.map((p) => p.key).join(".") || ("unknown" as string),
      message: issue.message as string,
    }));

    return SendErrorResponse(res, { name: "Validation Error", errors });
  }

  res.status(500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
};

export default GlobalError;
