import * as v from "valibot";
import {  GENDER } from "../prisma/app/generated/prisma/client";

const BloodGroupLabel = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  O_POS: "O+",
  O_NEG: "O-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
} as const;

const createUserSchema = v.object({
  profile: v.object({
    fullName: v.string(),
    age: v.number(),
    email: v.nullable(v.string()), // optional
    phoneNumber: v.string(),
    weight: v.number(),
    gender: v.enum(GENDER),
    bloodGroup: v.enum(BloodGroupLabel),
  }),
  credential: v.object({
    password: v.string(),
  }),
  address: v.object({
    area: v.nullable(v.string()), // optional
    division: v.string(),
    district: v.string(),
    upazila: v.string(),
  }),
  donationExperience: v.array(
    v.object({
      lastDonationDate: v.string(),
      lastDonationLocation: v.string(),
    })
  ),
});

export default createUserSchema;
