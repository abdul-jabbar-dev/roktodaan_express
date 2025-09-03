import prisma from "../../connection/db";
import { GetUsersParams, UserPayload } from "../../types/user";
import * as v from "valibot";
import createUserSchema from "../../validators/createUser";
import { mapBloodGroupLabelToEnum } from "../../mapping/bloodGroup";
import { CUSTOM_VALIBOT } from "../../constant/error_cont";
import { BloodGroup, Prisma } from "../../prisma/app/generated/prisma/client";
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

const USER_SERVICE = { createUserService, getUsersService, getUserService };
export default USER_SERVICE;
