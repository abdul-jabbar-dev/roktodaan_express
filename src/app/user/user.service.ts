import prisma from "../../connection/db";
import { GetUsersParams, UserPayload } from "../../types/user";
import * as v from "valibot";
import createUserSchema from "../../validators/createUser";
import { mapBloodGroupLabelToEnum } from "../../mapping/bloodGroup";
import { CUSTOM_VALIBOT } from "../../constant/error_cont";
import { Prisma } from "../../prisma/app/generated/prisma/client";
import JWT from "../../lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import sendOtpByEmail from "../../lib/supabase";
import genOTP from "../../utils/genOTP";
import { comparePassword } from "../../lib/bycrypt";
const createUserService = async (
  data: v.InferOutput<typeof createUserSchema>
) => {
  try {
    const exist_user = await prisma.user.findFirst({
      where: { profile: { email: data.profile.email } },
    });

    if (exist_user?.id)
      throw {
        message: "Email Already Exist!",
        from: CUSTOM_VALIBOT,
        field: "Email",
      };
    const createdUser: UserPayload = await prisma.user.create({
      data: {
        address: { create: data.address },
        donationExperience: { create: data.donationExperience },
        profile: {
          create: {
            ...data.profile,
            bloodGroup: mapBloodGroupLabelToEnum(data.profile.bloodGroup),
          },
        },
        credential: { create: data.credential },
      },
      include: {
        profile: true,
        address: true,
        donationExperience: true,
      },
    });
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const getUsersService = async (params?: GetUsersParams) => {
  const userQuary: Prisma.UserWhereInput = {};

  if (params?.bloodGroup) {
    userQuary.profile = {
      bloodGroup: params.bloodGroup, // already BloodGroup type
    };
  }
  try {
    const users = await prisma.user.findMany({
      where: userQuary,

      include: {
        address: true,
        donationExperience: true,
        profile: true,
      },
    });

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserService = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        address: true,
        donationExperience: true,
        profile: true,
        credential: { select: { randomPasswod: true, isVerify: true } },
      },
    });
    if (user?.id) {
      return user;
    } else {
      throw new Error("No User Found!");
    }
  } catch (error) {
    throw error;
  }
};

const getExistUser = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { profile: { email } },

      include: {
        profile: true,
      },
    });
    if (user?.id) {
      return user;
    } else {
      throw new Error("No User Found!");
    }
  } catch (error) {
    throw error;
  }
};
const getMyProfile = async (token: string) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: info?.id },
      include: {
        address: true,
        donationExperience: true,
        profile: true,
        credential: { select: { randomPasswod: true, isVerify: true } },
      },
    });
    if (user?.id) {
      return user;
    } else {
      return new Error("No User Found!");
    }
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (token: string, password: string) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;
    const user = await prisma.user.update({
      where: { id: info?.id },
      select: { credential: true },
      data: { credential: { update: { password, randomPasswod: false } } },
    });
    if (user?.credential?.id) {
      return { status: true };
    } else {
      throw new Error("No User Found!");
    }
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (token: string, profoleData: any) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;

    const user = await prisma.user.update({
      where: { id: info?.id },
      select: { profile: true },
      data: { profile: { update: { ...profoleData.profile } } },
    });
    if (user?.profile?.id) {
      return user;
    } else {
      throw new Error("No User Found!");
    }
  } catch (error) {
    throw error;
  }
};

const updateAddress = async (
  token: string,
  addressInfo: Prisma.AddressUpdateInput
) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;

    const user = await prisma.user.update({
      where: { id: info?.id },
      select: { address: true },
      data: { address: { update: { ...addressInfo } } },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
const updateExperiance = async (
  token: string,
  experianceInfo: Prisma.DonationExperienceCreateManyUserInput
) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;

    // conditionally prepare data
    let modi: any = {
      donationExperience: {
        create: experianceInfo,
      },
    };

    if (experianceInfo.id) {
      modi = {
        donationExperience: {
          update: {
            where: { id: experianceInfo.id },
            data: experianceInfo,
          },
        },
      };
    }

    // now use modi
    const user = await prisma.user.update({
      where: { id: info?.id },
      data: modi,
      select: { donationExperience: true },
    });

    return user;
  } catch (error) {
    throw error;
  }
};
const sendOTP = async (token: string, email: string) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;

    const userIDStatus = await prisma.user.findUnique({
      where: { id: info?.id },
      select: { credential: true },
    });
    if (userIDStatus?.credential?.isVerify) {
      new Error("Email Already Verify!");
    }
    const res = await sendOtpByEmail(email, genOTP());
    if (res?.messageId) {
      await prisma.user.update({
        where: { id: info?.id },
        data: {
          credential: {
            update: {
              otp: res?.otp,
              otpExp: new Date(Date.now() + 1000 * 60 * 5),
            },
          },
        },
      });
      return { status: true };
    }
  } catch (error) {
    throw error;
  }
};

const verifyOTP = async (token: string, otp: string | number) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;

    const userIDStatus = await prisma.user.findUnique({
      where: { id: info?.id },
      select: { credential: true, profile: true },
    });

    console.log(userIDStatus, otp);
    if (!userIDStatus?.profile?.email) {
      return { msg: "Email Not Found!" };
    }

    if (userIDStatus?.credential?.otp !== otp) {
      return { msg: "OTP Not Match!" };
    }
    if ((userIDStatus?.credential?.otpExp as Date) < new Date()) {
      return { msg: "OTP Expired!" };
    }
    await prisma.user.update({
      where: { id: info?.id },
      data: {
        credential: {
          update: {
            isVerify: true,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const existUser = await prisma.user.findFirst({
      where: { profile: { email } },
      include: { credential: true, profile: true },
    });

    if (!existUser) {
      return null; // email নাই
    }

    if (!comparePassword(password, existUser.credential?.password || "")) {
      return null; // password mismatch
    }

    return existUser; // শুধু user ফেরত দিচ্ছে
  } catch (error) {
    throw error;
  }
};

 


const USER_SERVICE = {
  createUserService,
  getUsersService,
  getUserService,
  getExistUser,
  updatePassword,
  getMyProfile,
  updateProfile,
  updateAddress,
  updateExperiance,
  sendOTP,
  verifyOTP,
  login,
};
export default USER_SERVICE;
