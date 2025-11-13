"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileIMG = exports.uploadImg = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const jwt_1 = __importDefault(require("../../lib/jwt"));
const db_1 = __importDefault(require("../../connection/db"));
const response_1 = require("../../schema/Response/response");
const user_service_1 = __importDefault(require("../user/user.service"));
const cloudinarySecureURLToPublicID_1 = require("../../utils/cloudinarySecureURLToPublicID");
const bucket_1 = require("../../constant/bucket");
const cludinary_1 = __importDefault(require("./../../lib/cludinary"));
const deleteMedia = (0, catchAsync_1.default)(async (req, res) => {
    const id = String(req.query?.public_id);
    if (id) {
        const res = await cludinary_1.default.uploader.destroy(id);
        (0, response_1.SendResponse)(res, {
            status: true,
            message: "Image delete successfully",
            img: res,
        });
    }
});
exports.uploadImg = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.token;
    // 🧩 1️⃣ Auth check
    if (!token || typeof token !== "string") {
        return res
            .status(401)
            .json({ error: "Authentication Failed. Please login first." });
    }
    // 🧩 2️⃣ File validation
    const file = req.file;
    if (!file || !file.buffer) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    // 🧩 3️⃣ Fetch user & existing image
    const profile = await user_service_1.default.getMyProfile(token);
    if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
    }
    let dbIMGPublicId = undefined;
    if (profile.profile?.img) {
        dbIMGPublicId = (0, cloudinarySecureURLToPublicID_1.extractPublicIdFromUrl)(profile.profile.img);
    }
    // 🧩 4️⃣ Upload or Replace image on Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cludinary_1.default.uploader.upload_stream({
            folder: dbIMGPublicId ? undefined : bucket_1.BUCKETS.PROFILE_IMAGES,
            public_id: dbIMGPublicId, // same public_id হলে replace হবে
            overwrite: true,
            resource_type: "image",
        }, (error, result) => {
            if (error || !result)
                reject(error);
            else
                resolve(result);
        });
        uploadStream.end(file.buffer);
    });
    // 🧩 5️⃣ Save to DB
    if (uploadResult?.secure_url) {
        const updatedUser = await db_1.default.user.update({
            where: { id: profile.id },
            data: {
                profile: {
                    update: {
                        img: uploadResult.secure_url,
                    },
                },
            },
            include: { profile: true },
        });
        return res.json({
            message: "Profile image updated successfully 🎉",
            imageUrl: updatedUser.profile?.img,
        });
    }
    // 🧩 6️⃣ Fallback error
    return res.status(500).json({ error: "Failed to upload or update image" });
});
exports.updateProfileIMG = (0, catchAsync_1.default)(async (req, res, next) => {
    // ✅ Step 1: Auth check
    if (!req.token) {
        return next({
            message: "Authentication Failed. Please login first.",
            field: "Auth Token Missing",
        });
    }
    // ✅ Step 2: Check if link is provided
    if (!req.query.link) {
        return next({
            message: "Update Info Required",
            field: "New Profile Image link missing",
        });
    }
    // ✅ Step 3: Decode token & extract user id
    const info = jwt_1.default.DecToken(req.token);
    try {
        // ✅ Step 4: Update user profile image
        const updated = await db_1.default.user.update({
            where: { id: info?.id },
            data: {
                profile: {
                    update: { img: req.query.link },
                },
            },
            select: {
                id: true,
                profile: true,
            },
        });
        if (!updated)
            throw new Error("Failed to update profile image in database!");
        // ✅ Step 5: Send response
        (0, response_1.SendResponse)(res, {
            status: true,
            message: "Profile image updated successfully",
            img: updated?.profile?.img,
        });
    }
    catch (error) {
        console.error("❌ Update Error:", error);
        next({
            message: error?.message ||
                error?.error ||
                "Database update failed unexpectedly",
        });
    }
});
const MEDIA_CONTROL = { deleteMedia, updateProfileIMG: exports.updateProfileIMG, uploadImg: exports.uploadImg };
exports.default = MEDIA_CONTROL;
