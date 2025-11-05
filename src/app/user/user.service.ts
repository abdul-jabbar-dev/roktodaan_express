import prisma from "../../connection/db";
import { GetUsersParams, UserPayload } from "../../types/user";
import * as v from "valibot";
import createUserSchema from "../../validators/createUser";
import { mapBloodGroupLabelToEnum } from "../../mapping/bloodGroup";
import { CUSTOM_VALIBOT } from "../../constant/error_cont";
import { otpType, Prisma } from "../../prisma/app/generated/prisma/client";
import { JwtPayload } from "jsonwebtoken";

import sendOtpByEmail from "../../lib/supabase";
import genOTP from "../../utils/genOTP";
import { comparePassword, hashedPassword } from "../../lib/bycrypt";
import { normalizeEmail } from "../../utils/normalizedEmail";
import JWT from "../../lib/jwt";

// ---------- Create User ----------
const createUserService = async (
  data: v.InferOutput<typeof createUserSchema>
) => {
  try {
    if (data.profile.email)
      data.profile.email = normalizeEmail(data.profile.email);

    const existUser = await prisma.user.findFirst({
      where: { profile: { email: data.profile.email } },
    });
    if (existUser)
      throw {
        message: "Email Already Exists!",
        from: CUSTOM_VALIBOT,
        field: "Email",
      };

    return await prisma.user.create({
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
      include: { profile: true, address: true, donationExperience: true },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create user");
  }
};

// ---------- Get All Users ----------
const getUsersService = async (params?: GetUsersParams) => {
  console.log(params);

  //   {
  //   bloodGroup: 'A_POS',
  //   address: { latitude: 23.9174294, longitude: 90.4001587 }
  // }

  try {
    const where: Prisma.UserWhereInput = {};
    if (params?.bloodGroup) where.profile = { bloodGroup: params.bloodGroup };
    if (
      params?.address &&
      typeof params.address === "object" &&
      (("division" in params.address &&
        typeof (params.address as any).division === "string") ||
        ("district" in params.address &&
          typeof (params.address as any).district === "string") ||
        ("upazila" in params.address &&
          typeof (params.address as any).upazila === "string"))
    ) {
      where.address = {
        ...("division" in params.address &&
        typeof (params.address as any).division === "string"
          ? { division: (params.address as any).division }
          : {}),
        ...("district" in params.address &&
        typeof (params.address as any).district === "string"
          ? { district: (params.address as any).district }
          : {}),
        ...("upazila" in params.address &&
        typeof (params.address as any).upazila === "string"
          ? { upazila: (params.address as any).upazila }
          : {}),
      };
    }

    return await prisma.user.findMany({
      where,
      include: { profile: true, address: true, donationExperience: true },
    });
  } catch {
    throw new Error("Failed to fetch users");
  }
};

// ---------- Get Single User ----------
const getUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      address: true,
      donationExperience: true,
      credential: { select: { randomPasswod: true, isVerify: true } },
    },
  });
  if (!user) throw new Error("No User Found!");
  return user;
};

// ---------- Get User by Email ----------
const getExistUser = async (email: string) => {
  email = normalizeEmail(email);
  const user = await prisma.user.findFirst({
    where: { profile: { email } },
    include: { profile: true },
  });
  if (!user) throw new Error("No User Found!");
  return user;
};

// ---------- Get My Profile ----------
const getMyProfile = async (token: string) => {
  const info = JWT.DecToken(token) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: { id: info?.id },
    include: {
      profile: true,
      address: true,
      donationExperience: true,
      credential: { select: { randomPasswod: true, isVerify: true } },
    },
  });
  if (!user) throw new Error("No User Found!");
  return user;
};

// ---------- Update Password ----------
const updatePassword = async (token: string, hashedPass: string) => {
  const info = JWT.DecToken(token) as JwtPayload;
  const updated = await prisma.user.update({
    where: { id: info?.id },
    data: {
      credential: { update: { password: hashedPass, randomPasswod: false } },
    },
    select: { id: true },
  });

  if (!updated) throw new Error("Failed to update password!");
  return { status: true };
};

// ---------- Update Profile ----------
const updateProfile = async (token: string, profileData: any) => {
  const info = JWT.DecToken(token) as JwtPayload;
  if (profileData.email) profileData.email = normalizeEmail(profileData.email);

  try {
    profileData.profile.userId = undefined;
    const updated = await prisma.user.update({
      where: { id: info?.id },
      data: { profile: { update: { ...profileData.profile } } },
      select: {
        id: true,
        profile: true,
        address: true,
        donationExperience: true,
      },
    });
    console.log("Updated profile:", updated);

    if (!updated) throw new Error("Failed to update profile!");
  } catch (error) {
    console.error("Error updating profile:", error);
  }
  return { status: true };
};

// ---------- Update Address ----------
const updateAddress = async (
  token: string,
  addressInfo: Prisma.AddressUpdateInput
) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;
    const res = await prisma.user.update({
      where: { id: info?.id },
      data: { address: { update: addressInfo } },
      select: { address: true },
    });
    if (!res.address) throw new Error("ঠিকানা আপডেট করতে ব্যর্থ হয়েছে");
    return { data: res.address };
  } catch (error: any) {
    return {
      status: false,
      error: error?.message || "Failed to update address!",
    };
  }
};

// ---------- Update Experience ----------
const updateExperience = async (
  token: string,
  experienceInfo: Prisma.DonationExperienceCreateManyUserInput & { id?: string }
) => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;
    const data = experienceInfo.id
      ? {
          donationExperience: {
            update: { where: { id: experienceInfo.id }, data: experienceInfo },
          },
        }
      : { donationExperience: { create: experienceInfo } };

    const res = await prisma.user.update({
      where: { id: info?.id },
      data,
      select: { donationExperience: true },
    });
    if (!res.donationExperience) throw new Error("অভিজ্ঞতা যোগ হয়নি");
    return { data: res.donationExperience };
  } catch (error: any) {
    return {
      status: false,
      error: error?.message || "Failed to Update Donation Experiance!",
    };
  }
};

// ---------- Send OTP ----------
const sendOTP = async (type: otpType, id: string, email: string) => {
  if (!email) throw new Error("Email Required!");
  email = normalizeEmail(email);

  const otpValue = genOTP();
  const emailRes = await sendOtpByEmail(email, otpValue, type);
  if (!emailRes?.success) throw new Error("Failed to send OTP!");

  await prisma.user.update({
    where: { id },
    data: {
      credential: {
        update: {
          otpType: type,
          otp: otpValue,
          otpExp: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
    },
  });

  return { status: true };
};

// ---------- Verify OTP ----------
const verifyOTP = async (
  otpType: otpType,
  token: string,
  otp: string | number,
  newPassword?: string
) => {
  const info = JWT.DecToken(token) as JwtPayload;
  const user: any = await prisma.user.findUnique({
    where: { id: info?.id },
    select: { credential: true, profile: true },
  });
  if (!user?.credential) throw new Error("Invalid user data!");

  if (user.credential.otpType !== otpType)
    throw new Error("OTP Type mismatch!");
  if (user.credential.otp !== otp) throw new Error("Incorrect OTP!");
  if (new Date(user?.credential?.otpExp) < new Date())
    throw new Error("OTP Expired!");

  if (otpType === "emailVerification") {
    await prisma.user.update({
      where: { id: info?.id },
      data: {
        credential: {
          update: {
            isVerify: true,
            otp: null,
            otpExp: null,
            otpType: null,
            otpTime: null,
          },
        },
      },
    });
  } else if (otpType === "passwordReset") {
    if (!newPassword) throw new Error("New Password Required!");
    const hashedPass = await hashedPassword(newPassword);

    await prisma.user.update({
      where: { id: info?.id },
      data: {
        credential: {
          update: {
            password: hashedPass,
            randomPasswod: false,
            otp: null,
            otpExp: null,
            otpType: null,
            otpTime: null,
          },
        },
      },
    });
  }

  return { status: true, error: "OTP Verified Successfully!" };
};

// ---------- Login ----------
const login = async (email: string, password: string) => {
  email = normalizeEmail(email);
  const user = await prisma.user.findFirst({
    where: { profile: { email } },
    include: { credential: true, profile: true },
  });

  if (!user || !comparePassword(password, user.credential?.password || ""))
    return null;
  return user;
};

// ---------- Forget Password ----------
const forgetPassword = async (email: string): Promise<{ status: boolean }> => {
  email = normalizeEmail(email);
  try {
    const user = await prisma.user.findFirst({
      where: { profile: { email } },
      include: { credential: true, profile: true },
    });
    if (!user) throw new Error("No User Found!");

    const { status } = await sendOTP("passwordReset", user.id, email);
    if (!status) throw new Error("Failed to send OTP!, Please try again.");

    return { status: true };
  } catch (err) {
    throw err;
  }
};

//server dident respond session status

const newPasswordWithOTP = async (
  token: string,
  otp: string,
  newPassword: string
): Promise<{ status: boolean }> => {
  try {
    const info = JWT.DecToken(token) as JwtPayload;

    if (!info?.email) throw new Error("Invalid token data!");

    const user = await prisma.user.findFirst({
      where: { profile: { email: normalizeEmail(info.email) } },
      include: { credential: true, profile: true },
    });

    if (!user) throw new Error("No user found!");

    const { credential } = user;

    if (
      !credential?.otp ||
      !credential?.otpExp ||
      credential.otpType !== "passwordReset"
    ) {
      throw new Error("যাচাইকরণ প্রক্রিয়াটি পুনরায় চেষ্টা করুন ");
    }

    if (Number(otp) !== credential.otp)
      throw new Error("OTP ভুল আবার চেষ্টা করুন !");
    if (new Date(credential.otpExp) < new Date())
      throw new Error("OTP Expired!");

    // ✅ Optional: update new password here if needed
    const hashedNewPassword = await hashedPassword(newPassword);
    await prisma.credential.update({
      where: { id: credential.id },
      data: {
        password: hashedNewPassword,
        otp: null,
        otpExp: null,
        otpType: null,
      },
    });
    // await prisma.credential.update({ where: { id: credential.id }, data: { password: hashedNewPassword, otp: null, otpExp: null } });

    return { status: true };
  } catch (err) {
    throw err;
  }
};

const checkBlacklistToken = async (token: string): Promise<boolean> => {
  const blacklisted = await prisma.blacklistToken.findUnique({
    where: { token },
  });
  return !!blacklisted;
};

// ---------- EXPORT ----------
const USER_SERVICE = {
  createUserService,
  getUsersService,
  getUserService,
  getExistUser,
  getMyProfile,
  updatePassword,
  updateProfile,
  updateAddress,
  updateExperience,
  sendOTP,
  verifyOTP,
  login,
  forgetPassword,
  checkBlacklistToken,
  newPasswordWithOTP,
};

export default USER_SERVICE;
