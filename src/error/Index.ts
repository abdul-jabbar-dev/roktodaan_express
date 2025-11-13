import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { ErrorRequestHandler } from "express";
import { BaseIssue } from "valibot";
// import { PrismaClientInitializationError } from "../prisma/app/generated/prisma/client/runtime/library";

export type SendFiledError = {
  field: string;
  error: string;
  path?: string;
};

const GlobalError: ErrorRequestHandler = (error, req, res, next) => {
  console.error("Global Error Handler:", error,"------------------------------------------------------------------------------------------------");
  // Default response
  let response = {
    status: "error",
    error:
      typeof error.message === "string"
        ? error.message
        : "Internal server error",
  } as { status: string; error: string | SendFiledError[] };

  // 🧠 Handle Prisma DB init error
  if (error instanceof PrismaClientInitializationError) {
    response.error = "Database connection error";
    return res.status(500).json(response);
  }

  // 🧩 Handle Valibot validation errors
  const issues = error?.errors?.issues as BaseIssue<any>[] | undefined;
  if (Array.isArray(issues)) {
    response.error = issues.map(
      (issue): SendFiledError => ({
        field: (issue.path?.[issue.path.length - 1]?.key ||
          "unknown") as string,
        path: issue.path?.map((p) => p.key).join(".") || "unknown",
        error: issue.message,
      })
    );
    return res.status(400).json(response);
  }

  // ⚙️ Custom flagged error (optional, e.g., duplicate phone)
  if (error?.from === "CUSTOM_VALIBOT") {
    response.error = [
      { field: "phoneNumber", error: "Phone number already exists!" },
    ];
    return res.status(400).json(response);
  }

  // 🪶 Simple string or general Error
  const message =
    typeof error === "string"
      ? error
      : error?.message || "Unknown server error";

  response.error = message;
  res.status(500).json(response);
};

export default GlobalError;
