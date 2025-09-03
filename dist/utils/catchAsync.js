"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
exports.default = catchAsync;
