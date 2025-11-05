"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("../prisma/app/generated/prisma/client/runtime/library");
const GlobalError = (error, req, res, next) => {
    console.error("Global Error Handler:", error, "------------------------------------------------------------------------------------------------");
    // Default response
    let response = {
        status: "error",
        error: typeof error.message === "string"
            ? error.message
            : "Internal server error",
    };
    // 🧠 Handle Prisma DB init error
    if (error instanceof library_1.PrismaClientInitializationError) {
        console.log("Prisma Initialization Error:", error);
        response.error = "Database connection error";
        return res.status(500).json(response);
    }
    // 🧩 Handle Valibot validation errors
    const issues = error?.errors?.issues;
    if (Array.isArray(issues)) {
        response.error = issues.map((issue) => ({
            field: (issue.path?.[issue.path.length - 1]?.key ||
                "unknown"),
            path: issue.path?.map((p) => p.key).join(".") || "unknown",
            error: issue.message,
        }));
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
    const message = typeof error === "string"
        ? error
        : error?.message || "Unknown server error";
    response.error = message;
    res.status(500).json(response);
};
exports.default = GlobalError;
