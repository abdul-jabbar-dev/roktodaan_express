import { BloodGroup, Prisma } from "../prisma/app/generated/prisma/client";

export type UserPayload = Prisma.UserGetPayload<{
  include: {
    address: true;
    donationExperience: true;
    profile: true;
  };
}>;

export type GetUsersParams = {
  bloodGroup: BloodGroup|undefined;
};
