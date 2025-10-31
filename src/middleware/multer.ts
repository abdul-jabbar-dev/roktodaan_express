import multer from "multer";
import path from "path";
import fs from "fs";

export enum MediaFolderName {
  PROFILE_IMG = "profile_images",
  DOCUMENTS = "documents",
  OTHERS = "others",
}

// 🔹 Dynamic storage config
const getStorage = (folderName: MediaFolderName = MediaFolderName.OTHERS) => {
  const uploadPath = path.join(process.cwd(), "uploads", folderName);

  // ensure folder exists
  fs.mkdirSync(uploadPath, { recursive: true });

  return multer.diskStorage({
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
export const handleFilesUpload = (
  incomingFileName: string,
  folderName?: MediaFolderName
) => {
  // const storage = getStorage(folderName);
  
  const upload = multer({ storage:multer.memoryStorage() });
  return upload.single(incomingFileName);
};
