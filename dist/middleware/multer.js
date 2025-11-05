"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFilesUpload = exports.MediaFolderName = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
var MediaFolderName;
(function (MediaFolderName) {
    MediaFolderName["PROFILE_IMG"] = "profile_images";
    MediaFolderName["DOCUMENTS"] = "documents";
    MediaFolderName["OTHERS"] = "others";
})(MediaFolderName || (exports.MediaFolderName = MediaFolderName = {}));
// 🔹 Dynamic storage config
const getStorage = (folderName = MediaFolderName.OTHERS) => {
    const uploadPath = path_1.default.join(process.cwd(), "uploads", folderName);
    // ensure folder exists
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
    return multer_1.default.diskStorage({
        destination: (_, __, cb) => {
            cb(null, uploadPath);
        },
        filename: (_, file, cb) => {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        },
    });
};
// 🔹 Handle file upload
const handleFilesUpload = (incomingFileName, folderName) => {
    // const storage = getStorage(folderName);
    const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
    return upload.single(incomingFileName);
};
exports.handleFilesUpload = handleFilesUpload;
