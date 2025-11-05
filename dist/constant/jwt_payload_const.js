"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordJWT_session = void 0;
exports.forgetPasswordJWT_session = {
    payload: (paylod) => {
        return {
            email: paylod.email,
            otpStatus: paylod.otpStatus,
            step: paylod.step,
        };
    },
    expiresIn: "5m",
};
