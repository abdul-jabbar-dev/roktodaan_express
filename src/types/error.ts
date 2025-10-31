// ===========================================================
// Error Response Types (Updated & Simplified)
// ===========================================================

/**
 * Individual field-level error item
 * e.g. { field: "email", error: "Invalid email format", path: "user.email" }
 */
export type SendFiledError = {
  field: string;
  error: string;
  path?: string;
};

/**
 * The main error response structure
 * e.g.
 * {
 *   status: "error",
 *   error: "Internal server error"
 * }
 * or
 * {
 *   status: "error",
 *   error: [
 *     { field: "email", error: "Invalid email" },
 *     { field: "password", error: "Too short" }
 *   ]
 * }
 */
export type SendError = {
  status: string; // usually "error" or "failed"
  error: string | SendFiledError[];
};

export default SendError;
