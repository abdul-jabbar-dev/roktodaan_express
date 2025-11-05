import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import USER_SERVICE from "./user.service";
import { otpType, Prisma } from "../../prisma/app/generated/prisma/client";
import { SendResponse } from "../../schema/Response/response";
import { mapBloodGroupLabelToEnum } from "../../mapping/bloodGroup";
import { GetUsersParams } from "../../types/user";
import JWT from "../../lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../connection/db";
import { forgetPasswordJWT_session } from "../../constant/jwt_payload_const";

type GetCreateUserPayload = Prisma.UserGetPayload<{
  include: { profile: true; address: true; donationExperience: true };
}>;
export const createUserControl: RequestHandler = catchAsync(
  async (req, res) => {
    const result: GetCreateUserPayload = await USER_SERVICE.createUserService(
      req.body
    );

    res.send({
      token: JWT.GenToken({
        id: result.id,
        fullName: result.profile?.fullName,
        phoneNumber: result.profile?.phoneNumber,
        email: result.profile?.email,
        createdAt: result.createdAt,
      }),
      user: result,
    });
  }
);

export const getUsers: RequestHandler = catchAsync(async (req, res) => {

  const authHeader = req.headers.authorization || undefined;
  const token = authHeader?.split(" ")[1] || undefined;

  const query: GetUsersParams = {
    bloodGroup: undefined,
    address: undefined,
  };
  if (typeof req.query.address === "string") {
    try {
      query.address = req.query.address = JSON.parse(req.query.address);
    } catch (err) {
      console.warn("Failed to parse req.query.address as JSON:", err);
    }
  }

  if (typeof req?.query?.bloodGroup === "string") {
    const enumMake = mapBloodGroupLabelToEnum(req.query.bloodGroup as string);
    query.bloodGroup =
      enumMake || (req.query.bloodGroup as string)?.toUpperCase();
  }

  const result: GetCreateUserPayload[] = await USER_SERVICE.getUsersService(
    query,
    token
  ); 
  SendResponse(res, result );
});

export const getUser: RequestHandler = catchAsync(async (req, res, next) => {
  const userId = req?.params?.id;
  if (userId) {
    const result: GetCreateUserPayload | {} = await USER_SERVICE.getUserService(
      userId
    );
    SendResponse(res, result);
  } else throw new Error("User ID Required");
});

export const getMyProfile: RequestHandler = catchAsync(
  async (req, res, next) => {
    // Bearer e

    if (!req.token) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const result: GetCreateUserPayload | {} = await USER_SERVICE.getMyProfile(
        req.token
      );
      SendResponse(res, result);
    }
  }
);

export const getExistUser: RequestHandler = catchAsync(
  async (req, res, next) => {
    const email = req?.params?.email;
    if (email) {
      const result: GetCreateUserPayload | {} = await USER_SERVICE.getExistUser(
        email
      );
      SendResponse(res, result);
    } else next({ field: "User ID", message: "User ID Required" });
  }
);

export const updatePassword: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.token) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      if (typeof req?.body?.password !== "string") {
        next({
          message: "New Password Required",
          field: "New Password Missing",
        });
      } else {
        const result = await USER_SERVICE.updatePassword(
          req.token,
          req?.body?.password
        );
        SendResponse(res, result);
      }
    }
  }
);
export const updateProfile: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.token) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      if (Object.keys(req?.body).length < 1) {
        next({
          message: "Update Info Required",
          field: "New Profile Missing",
        });
      } else {
        const result = await USER_SERVICE.updateProfile(req.token, req?.body);
        SendResponse(res, result);
      }
    }
  }
);

export const updateAddress: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.token) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      if (Object.keys(req?.body).length < 1) {
        next({
          message: "Update Info Required",
          field: "New Profile Missing",
        });
      } else {
        const result = await USER_SERVICE.updateAddress(req.token, req?.body);
        SendResponse(res, result);
      }
    }
  }
);
export const updateExperiance: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.token) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      if (Object.keys(req?.body).length < 1) {
        next({
          message: "Update Info Required",
          field: "New Profile Missing",
        });
      } else {
        const result = await USER_SERVICE.updateExperience(
          req.token,
          req?.body
        );
        SendResponse(res, result);
      }
    }
  }
);
export const forgetPassword: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (typeof req?.body?.email !== "string") {
      next({
        message: "Email Info Required",
        field: "Email Missing",
      });
    } else {
      const { status } = await USER_SERVICE.forgetPassword(req?.body?.email);
      if (!status) throw new Error("Failed to send forget password email!");

      // Genarate JWT Session Token
      const session_token = JWT.GenToken(
        forgetPasswordJWT_session.payload({
          email: req.body.email,
          otpStatus: "pending",
          step: "otp_sent",
        }),
        { expiresIn: forgetPasswordJWT_session.expiresIn }
      );

      res.cookie("session_token", session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 5 * 60 * 1000,
      });

      SendResponse(res, { session_token, status });
    }
  }
);

export const sendOTP: RequestHandler = catchAsync(async (req, res, next) => {
  if (!req.token) {
    next({
      message: "Authentication Failed Login in First",
      field: "Auth Token Missing",
    });
  } else {
    if (typeof req?.body?.email !== "string") {
      next({
        message: "Email Info Required",
        field: "Email Missing",
      });
    } else {
      const info = JWT.DecToken(req.token) as JwtPayload;

      const userIDStatus: any = await prisma.user.findUnique({
        where: { id: info?.id },
        select: { credential: true },
      });
      if (userIDStatus?.credential?.isVerify) {
        new Error("Email Already Verify!");
      }
      const result = await USER_SERVICE.sendOTP(
        "emailVerification",
        info?.id as string,
        req?.body?.email
      );
      SendResponse(res, result);
    }
  }
});
export const verifyOTP: RequestHandler = catchAsync(async (req, res, next) => {
  const otpType = req?.query.otpType as otpType;
  if (!req.token) {
    next({
      message: "Authentication Failed Login in First",
      field: "Auth Token Missing",
    });
  } else {
    if (typeof req?.body?.otp !== "string") {
      next({
        message: "OTP Info Required",
        field: "OTP Missing",
      });
    } else {
      const result = await USER_SERVICE.verifyOTP(
        otpType,
        req.token,
        Number(req?.body?.otp)
      );
      SendResponse(res, result);
    }
  }
});
export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return next({
      message: "Email & Password Required",
      field: "MissingCredentials",
    });
  }

  const result = await USER_SERVICE.login(email, password);

  if (!result) {
    return SendResponse(res, { error: "Invalid email or password" });
  }

  const token = JWT.GenToken({
    id: result.id,
    fullName: result.profile?.fullName,
    phoneNumber: result.profile?.phoneNumber,
    email: result.profile?.email,
    createdAt: result.createdAt,
  });

  return SendResponse(res, {
    message: "Successfully Login",
    token,
    user: result,
  });
});
export const newPasswordWithOTP: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { otp, newPassword } = req.body;
    const token = req.cookies.session_token;
    if (typeof newPassword !== "string")
      throw new Error("New Password Required");
    if (typeof otp !== "string") throw new Error("OTP Required");
    const result = await USER_SERVICE.newPasswordWithOTP(
      token,
      otp,
      newPassword
    );
    req.res?.clearCookie("session_token");
    SendResponse(res, result);
  }
);
const USER_CONTROL = {
  createUserControl,
  getExistUser,
  getUsers,
  getMyProfile,
  forgetPassword,
  getUser,
  updatePassword,
  updateProfile,
  updateAddress,
  updateExperiance,
  sendOTP,
  verifyOTP,
  login,
  newPasswordWithOTP,
};
export default USER_CONTROL;
