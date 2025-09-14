import prisma from "../../connection/db";
import { GetUsersParams, UserPayload } from "../../types/user";
import * as v from "valibot";
import createUserSchema from "../../validators/createUser";
import { mapBloodGroupLabelToEnum } from "../../mapping/bloodGroup";
import { CUSTOM_VALIBOT } from "../../constant/error_cont";
import { Prisma } from "../../prisma/app/generated/prisma/client";
import JWT from "../../lib/jwt";
const createUserService = async (
  data: v.InferOutput<typeof createUserSchema>
) => {
  try {
    const exist_user = await prisma.user.findFirst({
      where: { profile: { phoneNumber: data.profile.phoneNumber } },
    });

    if (exist_user?.id)
      throw {
        message: "Phone Number Already Exist!",
        from: CUSTOM_VALIBOT,
        field: "phoneNumber",
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

const getUserService = async (userId: string | number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },

      include: {
        address: true,
        donationExperience: true,
        profile: true,
      },
    });
    if (user?.id) {
      return user;
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};

const getExistUser = async (phoneNumber: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { profile: { phoneNumber } },

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
    const info = JWT.DecToken(token);
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
      throw new Error("No User Found!");
    }
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (token: string, password: string) => {
  try {
    const info = JWT.DecToken(token);
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

const updateProfile = async (token: string, profoleData: Any) => {
  try {
    const info = JWT.DecToken(token);
    console.log({ ...profoleData });
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
    const info = JWT.DecToken(token);

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
    const info = JWT.DecToken(token);

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
};
export default USER_SERVICE;
