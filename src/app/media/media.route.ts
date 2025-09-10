import { Router } from "express";
import MEDIA_CONTROL from "./media.control";

const mediaRoute = Router()
mediaRoute.delete('/delete',MEDIA_CONTROL.deleteMedia)
export default mediaRoute