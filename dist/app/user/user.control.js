"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordWithOTP = exports.login = exports.verifyOTP = exports.sendOTP = exports.forgetPassword = exports.updateExperiance = exports.updateAddress = exports.updateProfile = exports.updatePassword = exports.getExistUser = exports.getMyProfile = exports.getUser = exports.getUsers = exports.createUserControl = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = __importDefault(require("./user.service"));
const response_1 = require("../../schema/Response/response");
const bloodGroup_1 = require("../../mapping/bloodGroup");
const jwt_1 = __importDefault(require("../../lib/jwt"));
const db_1 = __importDefault(require("../../connection/db"));
const jwt_payload_const_1 = require("../../constant/jwt_payload_const");
exports.createUserControl = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.default.createUserService(req.body);
    res.send({
        token: jwt_1.default.GenToken({
            id: result.id,
            fullName: result.profile?.fullName,
            phoneNumber: result.profile?.phoneNumber,
            email: result.profile?.email,
            createdAt: result.createdAt,
        }),
        user: result,
    });
});
exports.getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const authHeader = req.headers.authorization || undefined;
    const token = authHeader?.split(" ")[1] || undefined;
    const query = {
        bloodGroup: undefined,
        address: undefined,
    };
    if (typeof req.query.address === "string") {
        try {
            query.address = req.query.address = JSON.parse(req.query.address);
        }
        catch (err) {
            console.warn("Failed to parse req.query.address as JSON:", err);
        }
    }
    if (typeof req?.query?.bloodGroup === "string") {
        const enumMake = (0, bloodGroup_1.mapBloodGroupLabelToEnum)(req.query.bloodGroup);
        query.bloodGroup =
            enumMake || req.query.bloodGroup?.toUpperCase();
    }
    const result = await user_service_1.default.getUsersService(query, token);
    (0, response_1.SendResponse)(res, result);
});
exports.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req?.params?.id;
    if (userId) {
        const result = await user_service_1.default.getUserService(userId);
        (0, response_1.SendResponse)(res, result);
    }
    else
        throw new Error("User ID Required");
});
exports.getMyProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    // Bearer e
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        const result = await user_service_1.default.getMyProfile(req.token);
        (0, response_1.SendResponse)(res, result);
    }
});
exports.getExistUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const email = req?.params?.email;
    if (email) {
        const result = await user_service_1.default.getExistUser(email);
        (0, response_1.SendResponse)(res, result);
    }
    else
        next({ field: "User ID", message: "User ID Required" });
});
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        if (typeof req?.body?.password !== "string") {
            next({
                message: "New Password Required",
                field: "New Password Missing",
            });
        }
        else {
            const result = await user_service_1.default.updatePassword(req.token, req?.body?.password);
            (0, response_1.SendResponse)(res, result);
        }
    }
});
exports.updateProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        if (Object.keys(req?.body).length < 1) {
            next({
                message: "Update Info Required",
                field: "New Profile Missing",
            });
        }
        else {
            const result = await user_service_1.default.updateProfile(req.token, req?.body);
            (0, response_1.SendResponse)(res, result);
        }
    }
});
exports.updateAddress = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        if (Object.keys(req?.body).length < 1) {
            next({
                message: "Update Info Required",
                field: "New Profile Missing",
            });
        }
        else {
            const result = await user_service_1.default.updateAddress(req.token, req?.body);
            (0, response_1.SendResponse)(res, result);
        }
    }
});
exports.updateExperiance = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        if (Object.keys(req?.body).length < 1) {
            next({
                message: "Update Info Required",
                field: "New Profile Missing",
            });
        }
        else {
            const result = await user_service_1.default.updateExperience(req.token, req?.body);
            (0, response_1.SendResponse)(res, result);
        }
    }
});
exports.forgetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    if (typeof req?.body?.email !== "string") {
        next({
            message: "Email Info Required",
            field: "Email Missing",
        });
    }
    else {
        const { status } = await user_service_1.default.forgetPassword(req?.body?.email);
        if (!status)
            throw new Error("Failed to send forget password email!");
        // Genarate JWT Session Token
        const session_token = jwt_1.default.GenToken(jwt_payload_const_1.forgetPasswordJWT_session.payload({
            email: req.body.email,
            otpStatus: "pending",
            step: "otp_sent",
        }), { expiresIn: jwt_payload_const_1.forgetPasswordJWT_session.expiresIn });
        res.cookie("session_token", session_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 5 * 60 * 1000,
        });
        (0, response_1.SendResponse)(res, { session_token, status });
    }
});
exports.sendOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        if (typeof req?.body?.email !== "string") {
            next({
                message: "Email Info Required",
                field: "Email Missing",
            });
        }
        else {
            const info = jwt_1.default.DecToken(req.token);
            const userIDStatus = await db_1.default.user.findUnique({
                where: { id: info?.id },
                select: { credential: true },
            });
            if (userIDStatus?.credential?.isVerify) {
                new Error("Email Already Verify!");
            }
            const result = await user_service_1.default.sendOTP("emailVerification", info?.id, req?.body?.email);
            (0, response_1.SendResponse)(res, result);
        }
    }
});
exports.verifyOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const otpType = req?.query.otpType;
    if (!req.token) {
        next({
            message: "Authentication Failed Login in First",
            field: "Auth Token Missing",
        });
    }
    else {
        if (typeof req?.body?.otp !== "string") {
            next({
                message: "OTP Info Required",
                field: "OTP Missing",
            });
        }
        else {
            const result = await user_service_1.default.verifyOTP(otpType, req.token, Number(req?.body?.otp));
            (0, response_1.SendResponse)(res, result);
        }
    }
});
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        return next({
            message: "Email & Password Required",
            field: "MissingCredentials",
        });
    }
    const result = await user_service_1.default.login(email, password);
    if (!result) {
        return (0, response_1.SendResponse)(res, { error: "Invalid email or password" });
    }
    const token = jwt_1.default.GenToken({
        id: result.id,
        fullName: result.profile?.fullName,
        phoneNumber: result.profile?.phoneNumber,
        email: result.profile?.email,
        createdAt: result.createdAt,
    });
    return (0, response_1.SendResponse)(res, {
        message: "Successfully Login",
        token,
        user: result,
    });
});
exports.newPasswordWithOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const { otp, newPassword } = req.body;
    const token = req.cookies.session_token;
    if (typeof newPassword !== "string")
        throw new Error("New Password Required");
    if (typeof otp !== "string")
        throw new Error("OTP Required");
    const result = await user_service_1.default.newPasswordWithOTP(token, otp, newPassword);
    req.res?.clearCookie("session_token");
    (0, response_1.SendResponse)(res, result);
});
const USER_CONTROL = {
    createUserControl: exports.createUserControl,
    getExistUser: exports.getExistUser,
    getUsers: exports.getUsers,
    getMyProfile: exports.getMyProfile,
    forgetPassword: exports.forgetPassword,
    getUser: exports.getUser,
    updatePassword: exports.updatePassword,
    updateProfile: exports.updateProfile,
    updateAddress: exports.updateAddress,
    updateExperiance: exports.updateExperiance,
    sendOTP: exports.sendOTP,
    verifyOTP: exports.verifyOTP,
    login: exports.login,
    newPasswordWithOTP: exports.newPasswordWithOTP,
};
exports.default = USER_CONTROL;
