import { Router } from "express";
import MEDIA_CONTROL from "./media.control";
import { verifyToken } from "../../middleware/verify_token";
import { handleFilesUpload, MediaFolderName } from "../../middleware/multer";

const mediaRoute = Router();
mediaRoute.post(
  "/upload_img",
 
  verifyToken,
  handleFilesUpload("profile", MediaFolderName.PROFILE_IMG),
  MEDIA_CONTROL.uploadImg
);
mediaRoute.delete("/delete", MEDIA_CONTROL.deleteMedia);

mediaRoute.put(
  "/update_profile_img",
  verifyToken,
  MEDIA_CONTROL.updateProfileIMG
);
export default mediaRoute;
