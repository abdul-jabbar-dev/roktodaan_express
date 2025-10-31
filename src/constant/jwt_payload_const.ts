import { StringValue } from "ms";

export const forgetPasswordJWT_session: {
  payload: any;
  expiresIn: StringValue | number;
} = {
  payload: (paylod: {
    email: string;
    otpStatus: "pending" | "verified";
    step: "otp_sent" | "otp_verified";
  }) => {
    return {
      email: paylod.email,
      otpStatus: paylod.otpStatus,
      step: paylod.step,
    };
  },
  expiresIn: "5m",
};
