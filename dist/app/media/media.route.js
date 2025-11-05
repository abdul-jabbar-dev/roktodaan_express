"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_control_1 = __importDefault(require("./media.control"));
const verify_token_1 = require("../../middleware/verify_token");
const multer_1 = require("../../middleware/multer");
const mediaRoute = (0, express_1.Router)();
mediaRoute.post("/upload_img", verify_token_1.verifyToken, (0, multer_1.handleFilesUpload)("profile", multer_1.MediaFolderName.PROFILE_IMG), media_control_1.default.uploadImg);
mediaRoute.delete("/delete", media_control_1.default.deleteMedia);
mediaRoute.put("/update_profile_img", verify_token_1.verifyToken, media_control_1.default.updateProfileIMG);
exports.default = mediaRoute;
