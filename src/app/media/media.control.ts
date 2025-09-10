import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import cloudinary from "../../lib/cludinary";

const deleteMedia: RequestHandler = catchAsync(async (req, res) => {
  const id: string = String(req.query?.public_id);
  if (id) {
    const res = await cloudinary.uploader.destroy(id as string);
    console.log(res);
  }
});
const MEDIA_CONTROL = { deleteMedia };
export default MEDIA_CONTROL;
