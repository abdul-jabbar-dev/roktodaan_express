// import { BloodGroup, Prisma } from "../prisma/app/generated/prisma/client";

import { BloodGroup, Prisma } from "@prisma/client";

export type UserPayload = Prisma.UserGetPayload<{
  include: {
    address: true;
    donationExperience: true;
    profile: true;
  };
}>;

export type GetUsersParams = {
  bloodGroup: BloodGroup | undefined;
  address:
    | { latitude: number; longitude: number }
    | { division: string; district: string; upazila: string }|undefined;
};
