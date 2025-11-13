"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../connection/db"));
const bloodGroup_1 = require("../../mapping/bloodGroup");
const error_cont_1 = require("../../constant/error_cont");
const supabase_1 = __importDefault(require("../../lib/supabase"));
const genOTP_1 = __importDefault(require("../../utils/genOTP"));
const bycrypt_1 = require("../../lib/bycrypt");
const normalizedEmail_1 = require("../../utils/normalizedEmail");
const jwt_1 = __importDefault(require("../../lib/jwt"));
// ---------- Create User ----------
const createUserService = async (data) => {
    try {
        if (data.profile.email)
            data.profile.email = (0, normalizedEmail_1.normalizeEmail)(data.profile.email);
        const existUser = await db_1.default.user.findFirst({
            where: { profile: { email: data.profile.email } },
        });
        if (existUser)
            throw {
                message: "Email Already Exists!",
                from: error_cont_1.CUSTOM_VALIBOT,
                field: "Email",
            };
        return await db_1.default.user.create({
            data: {
                address: { create: data.address },
                donationExperience: { create: data.donationExperience },
                profile: {
                    create: {
                        ...data.profile,
                        bloodGroup: (0, bloodGroup_1.mapBloodGroupLabelToEnum)(data.profile.bloodGroup),
                    },
                },
                credential: { create: data.credential },
            },
            include: { profile: true, address: true, donationExperience: true },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create user");
    }
};
// ---------- Get All Users ----------
const getUsersService = async (params, token) => {
    let id;
    if (token) {
        id = jwt_1.default.DecToken(token)?.id || undefined;
    }
    try {
        const where = {};
        if (id) {
            where.NOT = {
                id: id,
            };
        }
        if (params?.bloodGroup) {
            where.profile = { bloodGroup: params.bloodGroup };
        }
        if (params?.address &&
            typeof params.address === "object" &&
            (("division" in params.address &&
                typeof params.address.division === "string") ||
                ("district" in params.address &&
                    typeof params.address.district === "string") ||
                ("upazila" in params.address &&
                    typeof params.address.upazila === "string"))) {
            where.address = {
                ...("division" in params.address &&
                    typeof params.address.division === "string"
                    ? { division: params.address.division }
                    : {}),
                ...("district" in params.address &&
                    typeof params.address.district === "string"
                    ? { district: params.address.district }
                    : {}),
                ...("upazila" in params.address &&
                    typeof params.address.upazila === "string"
                    ? { upazila: params.address.upazila }
                    : {}),
            };
        }
        const users = await db_1.default.user.findMany({
            where,
            include: {
                profile: true,
                address: true,
                donationExperience: true,
            },
        });
        return users;
    }
    catch (e) {
        console.error("Error fetching users:", e);
        throw new Error("Failed to fetch users");
    }
};
// ---------- Get All popular Users ----------
const getPopularUsersService = async (params, token) => {
    let id;
    if (token) {
        id = jwt_1.default.DecToken(token)?.id || undefined;
    }
    try {
        const where = {};
        if (id) {
            where.NOT = {
                id: id,
            };
        }
        if (params?.bloodGroup) {
            where.profile = { bloodGroup: params.bloodGroup };
        }
        if (params?.address &&
            typeof params.address === "object" &&
            (("division" in params.address &&
                typeof params.address.division === "string") ||
                ("district" in params.address &&
                    typeof params.address.district === "string") ||
                ("upazila" in params.address &&
                    typeof params.address.upazila === "string"))) {
            where.address = {
                ...("division" in params.address &&
                    typeof params.address.division === "string"
                    ? { division: params.address.division }
                    : {}),
                ...("district" in params.address &&
                    typeof params.address.district === "string"
                    ? { district: params.address.district }
                    : {}),
                ...("upazila" in params.address &&
                    typeof params.address.upazila === "string"
                    ? { upazila: params.address.upazila }
                    : {}),
            };
        }
        const users = await db_1.default.user.findMany({
            where: {
                ...(where && where),
                donationExperience: {
                    some: {}, // at least one donation
                },
            },
            include: {
                profile: true,
                address: true,
                donationExperience: true,
                _count: { select: { donationExperience: true } },
            },
            orderBy: {
                donationExperience: { _count: "desc" },
            },
        });
        // only keep users with > 1 donation
        const filtered = users.filter((u) => u._count.donationExperience > 1);
        console.log(filtered);
        return filtered;
    }
    catch (e) {
        console.error("Error fetching users:", e);
        throw new Error("Failed to fetch users");
    }
};
// ---------- Get Single User ----------
const getUserService = async (userId) => {
    const user = await db_1.default.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            address: true,
            donationExperience: true,
            credential: { select: { randomPasswod: true, isVerify: true } },
        },
    });
    if (!user)
        throw new Error("No User Found!");
    return user;
};
// ---------- Get User by Email ----------
const getExistUser = async (email) => {
    email = (0, normalizedEmail_1.normalizeEmail)(email);
    const user = await db_1.default.user.findFirst({
        where: { profile: { email } },
        include: { profile: true },
    });
    if (!user)
        throw new Error("No User Found!");
    return user;
};
// ---------- Get My Profile ----------
const getMyProfile = async (token) => {
    const info = jwt_1.default.DecToken(token);
    const user = await db_1.default.user.findUnique({
        where: { id: info?.id },
        include: {
            profile: true,
            address: true,
            bloodRequest: { include: { donations: { include: { reserved: { include: { donor: { include: { profile: true, address: true } } } } } } } },
            donationExperience: true,
            credential: { select: { randomPasswod: true, isVerify: true } },
        },
    });
    if (!user)
        throw new Error("No User Found!");
    return user;
};
// ---------- Update Password ----------
const updatePassword = async (token, hashedPass) => {
    const info = jwt_1.default.DecToken(token);
    const updated = await db_1.default.user.update({
        where: { id: info?.id },
        data: {
            credential: { update: { password: hashedPass, randomPasswod: false } },
        },
        select: { id: true },
    });
    if (!updated)
        throw new Error("Failed to update password!");
    return { status: true };
};
// ---------- Update Profile ----------
const updateProfile = async (token, profileData) => {
    const info = jwt_1.default.DecToken(token);
    if (profileData.email)
        profileData.email = (0, normalizedEmail_1.normalizeEmail)(profileData.email);
    try {
        profileData.profile.userId = undefined;
        const updated = await db_1.default.user.update({
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
        if (!updated)
            throw new Error("Failed to update profile!");
    }
    catch (error) {
        console.error("Error updating profile:", error);
    }
    return { status: true };
};
// ---------- Update Address ----------
const updateAddress = async (token, addressInfo) => {
    try {
        const info = jwt_1.default.DecToken(token);
        const res = await db_1.default.user.update({
            where: { id: info?.id },
            data: { address: { update: addressInfo } },
            select: { address: true },
        });
        if (!res.address)
            throw new Error("ঠিকানা আপডেট করতে ব্যর্থ হয়েছে");
        return { data: res.address };
    }
    catch (error) {
        return {
            status: false,
            error: error?.message || "Failed to update address!",
        };
    }
};
// ---------- Update Experience ----------
const updateExperience = async (token, experienceInfo) => {
    try {
        const info = jwt_1.default.DecToken(token);
        const data = experienceInfo.id
            ? {
                donationExperience: {
                    update: { where: { id: experienceInfo.id }, data: experienceInfo },
                },
            }
            : { donationExperience: { create: experienceInfo } };
        const res = await db_1.default.user.update({
            where: { id: info?.id },
            data,
            select: { donationExperience: true },
        });
        if (!res.donationExperience)
            throw new Error("অভিজ্ঞতা যোগ হয়নি");
        return { data: res.donationExperience };
    }
    catch (error) {
        return {
            status: false,
            error: error?.message || "Failed to Update Donation Experiance!",
        };
    }
};
// ---------- Send OTP ----------
const sendOTP = async (type, id, email) => {
    if (!email)
        throw new Error("Email Required!");
    email = (0, normalizedEmail_1.normalizeEmail)(email);
    const otpValue = (0, genOTP_1.default)();
    const emailRes = await (0, supabase_1.default)(email, otpValue, type);
    if (!emailRes?.success)
        throw new Error("Failed to send OTP!");
    await db_1.default.user.update({
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
const verifyOTP = async (otpType, token, otp, newPassword) => {
    const info = jwt_1.default.DecToken(token);
    const user = await db_1.default.user.findUnique({
        where: { id: info?.id },
        select: { credential: true, profile: true },
    });
    if (!user?.credential)
        throw new Error("Invalid user data!");
    if (user.credential.otpType !== otpType)
        throw new Error("OTP Type mismatch!");
    if (user.credential.otp !== otp)
        throw new Error("Incorrect OTP!");
    if (new Date(user?.credential?.otpExp) < new Date())
        throw new Error("OTP Expired!");
    if (otpType === "emailVerification") {
        await db_1.default.user.update({
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
    }
    else if (otpType === "passwordReset") {
        if (!newPassword)
            throw new Error("New Password Required!");
        const hashedPass = await (0, bycrypt_1.hashedPassword)(newPassword);
        await db_1.default.user.update({
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
const login = async (email, password) => {
    email = (0, normalizedEmail_1.normalizeEmail)(email);
    const user = await db_1.default.user.findFirst({
        where: { profile: { email } },
        include: { credential: true, profile: true },
    });
    if (!user || !(0, bycrypt_1.comparePassword)(password, user.credential?.password || ""))
        return null;
    return user;
};
// ---------- Forget Password ----------
const forgetPassword = async (email) => {
    email = (0, normalizedEmail_1.normalizeEmail)(email);
    try {
        const user = await db_1.default.user.findFirst({
            where: { profile: { email } },
            include: { credential: true, profile: true },
        });
        if (!user)
            throw new Error("No User Found!");
        const { status } = await sendOTP("passwordReset", user.id, email);
        if (!status)
            throw new Error("Failed to send OTP!, Please try again.");
        return { status: true };
    }
    catch (err) {
        throw err;
    }
};
//server dident respond session status
const newPasswordWithOTP = async (token, otp, newPassword) => {
    try {
        const info = jwt_1.default.DecToken(token);
        if (!info?.email)
            throw new Error("Invalid token data!");
        const user = await db_1.default.user.findFirst({
            where: { profile: { email: (0, normalizedEmail_1.normalizeEmail)(info.email) } },
            include: { credential: true, profile: true },
        });
        if (!user)
            throw new Error("No user found!");
        const { credential } = user;
        if (!credential?.otp ||
            !credential?.otpExp ||
            credential.otpType !== "passwordReset") {
            throw new Error("যাচাইকরণ প্রক্রিয়াটি পুনরায় চেষ্টা করুন ");
        }
        if (Number(otp) !== credential.otp)
            throw new Error("OTP ভুল আবার চেষ্টা করুন !");
        if (new Date(credential.otpExp) < new Date())
            throw new Error("OTP Expired!");
        // ✅ Optional: update new password here if needed
        const hashedNewPassword = await (0, bycrypt_1.hashedPassword)(newPassword);
        await db_1.default.credential.update({
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
    }
    catch (err) {
        throw err;
    }
};
const checkBlacklistToken = async (token) => {
    const blacklisted = await db_1.default.blacklistToken.findUnique({
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
    getPopularUsersService,
};
exports.default = USER_SERVICE;
