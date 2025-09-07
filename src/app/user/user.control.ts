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
    const phoneNumber = req?.params?.number;
    if (phoneNumber) {
      const result: GetCreateUserPayload | {} = await USER_SERVICE.getExistUser(
        phoneNumber
      );
      SendResponse(res, result);
    } else next({ field: "User ID", message: "User ID Required" });
  }
);

const USER_CONTROL = {
  createUserControl,
  getExistUser,
  getUsers,
  getMyProfile,
  getUser,
};
export default USER_CONTROL;
