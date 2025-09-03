import { RequestHandler } from "express";
import * as v from "valibot";
import { VALIBOT } from "../constant/error_cont";

const validatorMiddleware = <
  T extends
    | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
    | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>
    | v.BaseValidation<any, unknown, v.BaseIssue<unknown>>
    | v.BaseValidationAsync<any, unknown, v.BaseIssue<unknown>>
    | v.BaseTransformation<any, unknown, v.BaseIssue<unknown>>
    | v.BaseTransformationAsync<any, unknown, v.BaseIssue<unknown>>
    | v.BaseMetadata<any>
>(
  schema: T
): RequestHandler => {
  return (req, res, next) => {
    const result = v.safeParse(schema as any, req.body, { abortEarly: false });

    if (result.success) {
      req.body = result.output as v.InferOutput<T>;
      next();
    } else {
      next({
        from: VALIBOT,
        errors: result as
          | {
              success: true;
              output: v.InferOutput<T>;
              typed: true;
              issues: undefined;
            }
          | {
              success: false;
              output: undefined;
              typed: true;
              issues: v.BaseIssue<T>[];
            },
      });
    }
  };
};

export default validatorMiddleware;
