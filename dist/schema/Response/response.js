"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponse = void 0;
const SendErrorResponse = (res, issue) => {
    const error = {
        status: false,
        error: issue,
    };
    res.send(error);
};
exports.default = SendErrorResponse;
const SendResponse = (res, data) => {
    const result = {
        status: true,
        data,
    };
    res.send(result);
};
exports.SendResponse = SendResponse;
