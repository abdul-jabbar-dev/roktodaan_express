import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import USER_SERVICE from "./user.service";
import { Prisma } from "../../prisma/app/generated/prisma/client";
import { SendResponse } from "../../schema/Response/response";
import { mapBloodGroupLabelToEnum } from "../../mapping/bloodGroup";
import { GetUsersParams } from "../../types/user";
import JWT from "../../lib/jwt"; 

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
        email:result.profile?.email,
        createdAt: result.createdAt,
      }),
      user: result,
    });
  }
);

export const getUsers: RequestHandler = catchAsync(async (req, res) => {
  const query: GetUsersParams = {
    bloodGroup: undefined,
  };
  if (typeof req?.query?.bloodgroup === "string") {
    const enumMake = mapBloodGroupLabelToEnum(req.query.bloodgroup as string);

    query.bloodGroup =
      enumMake || (req.query.bloodgroup as string)?.toUpperCase();
  }

  const result: GetCreateUserPayload[] = await USER_SERVICE.getUsersService(
    query
  );
  SendResponse(res, result);
});

export const getUser: RequestHandler = catchAsync(async (req, res, next) => {
  const userId = req?.params?.user_id;
  if (userId) {
    const result: GetCreateUserPayload | {} = await USER_SERVICE.getUserService(
      userId
    );
    SendResponse(res, result);
  } else next({ field: "User ID", message: "User ID Required" });
});
export const getMyProfile: RequestHandler = catchAsync(
  async (req, res, next) => {
    // Bearer e
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      const result: GetCreateUserPayload | {} = await USER_SERVICE.getMyProfile(
        token
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
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      if (typeof req?.body?.password !== "string") {
        next({
          message: "New Password Required",
          field: "New Password Missing",
        });
      } else {
        const result = await USER_SERVICE.updatePassword(
          token,
          req?.body?.password
        );
        SendResponse(res, result);
      }
    }
  }
);
export const updateProfile: RequestHandler = catchAsync(
  async (req, res, next) => {
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      if (Object.keys(req?.body).length < 1) {
        next({
          message: "Update Info Required",
          field: "New Profile Missing",
        });
      } else {
        const result = await USER_SERVICE.updateProfile(token, req?.body);
        console.log(result);
        SendResponse(res, result);
      }
    }
  }
);

export const updateAddress: RequestHandler = catchAsync(
  async (req, res, next) => {
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      if (Object.keys(req?.body).length < 1) {
        next({
          message: "Update Info Required",
          field: "New Profile Missing",
        });
      } else {
        const result = await USER_SERVICE.updateAddress(token, req?.body);
        console.log(result);
        SendResponse(res, result);
      }
    }
  }
);
export const updateExperiance: RequestHandler = catchAsync(
  async (req, res, next) => {
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      if (Object.keys(req?.body).length < 1) {
        next({
          message: "Update Info Required",
          field: "New Profile Missing",
        });

      } else {
        const result = await USER_SERVICE.updateExperiance(token, req?.body);
        console.log(result);
        SendResponse(res, result);
      }
    }
  }
);

export const sendOTP: RequestHandler = catchAsync(
  async (req, res, next) => {
    console.log(req.body)
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      if (typeof(req?.body?.email)!=='string') {
        next({
          message: "Email Info Required",
          field: "Email Missing",
        });

      } else {
        const result = await USER_SERVICE.sendOTP(token, req?.body?.email);
        console.log(result);
        SendResponse(res, result);
      }
    }
  }
);

export const verifyOTP: RequestHandler = catchAsync(
  async (req, res, next) => {
 
    const cookieToken = req.headers?.authorization;
    if (!cookieToken) {
      next({
        message: "Authentication Failed Login in First",
        field: "Auth Token Missing",
      });
    } else {
      const token = cookieToken.split(" ")[1];
      if (typeof(req?.body?.otp)!=='string') {
        next({
          message: "OTP Info Required",
          field: "OTP Missing",
        }); 
      } else {
        const result = await USER_SERVICE.verifyOTP(token, Number(req?.body?.otp));
        console.log(result);
        SendResponse(res, result);
      }
    }
  }
);

const USER_CONTROL = {
  createUserControl,
  getExistUser,
  getUsers,
  getMyProfile,
  getUser,
  updatePassword,
  updateProfile,
  updateAddress,
  updateExperiance,
  sendOTP,
  verifyOTP
};
export default USER_CONTROL;
