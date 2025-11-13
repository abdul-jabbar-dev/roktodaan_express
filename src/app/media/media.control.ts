import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
 
import JWT from "../../lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../connection/db";
import { SendResponse } from "../../schema/Response/response";
import USER_SERVICE from "../user/user.service";
import { extractPublicIdFromUrl } from "../../utils/cloudinarySecureURLToPublicID";
import { BUCKETS } from "../../constant/bucket";
import cloudinary from './../../lib/cludinary';

const deleteMedia: RequestHandler = catchAsync(async (req, res) => {
  const id: string = String(req.query?.public_id);
  if (id) {
    const res = await cloudinary.uploader.destroy(id as string);

   SendResponse(res, {
        status: true,
        message: "Image delete successfully",
        img:res,
      });
  }
});
 

export const uploadImg: RequestHandler = catchAsync(async (req, res) => {
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
  const profile = await USER_SERVICE.getMyProfile(token);
  if (!profile) {
    return res.status(404).json({ error: "User profile not found" });
  }

  let dbIMGPublicId: string | undefined = undefined;
  if (profile.profile?.img) {
    dbIMGPublicId = extractPublicIdFromUrl(profile.profile.img);
  }

  // 🧩 4️⃣ Upload or Replace image on Cloudinary
  const uploadResult: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: dbIMGPublicId?undefined:BUCKETS.PROFILE_IMAGES,
        public_id: dbIMGPublicId, // same public_id হলে replace হবে
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

  // 🧩 5️⃣ Save to DB
  if (uploadResult?.secure_url) {
    const updatedUser = await prisma.user.update({
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

export const updateProfileIMG: RequestHandler = catchAsync(
  async (req, res, next) => {
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
    const info = JWT.DecToken(req.token) as JwtPayload;

    try {
      // ✅ Step 4: Update user profile image
      const updated = await prisma.user.update({
        where: { id: info?.id },
        data: {
          profile: {
            update: { img: req.query.link as string },
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
      SendResponse(res, {
        status: true,
        message: "Profile image updated successfully",
        img: updated?.profile?.img,
      });
    } catch (error: any) {
      console.error("❌ Update Error:", error);
      next({
        message:
          error?.message ||
          error?.error ||
          "Database update failed unexpectedly",
      });
    }
  }
);

const MEDIA_CONTROL = { deleteMedia, updateProfileIMG, uploadImg };
export default MEDIA_CONTROL;
