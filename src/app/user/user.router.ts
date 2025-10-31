import Express from "express";
import USER_CONTROL from "./user.control";
import validatorMiddleware from "../../middleware/valibot";
import createUserSchema from "../../validators/createUser";
import PasswordEncrypted from "../../middleware/password_encrypted";
import { verifyToken } from "../../middleware/verify_token";
import { getSessionStatus } from "../session/session.control";
const userRouter = Express.Router();

userRouter.post(
  "/create_user",
  validatorMiddleware(createUserSchema),
  PasswordEncrypted(),
  USER_CONTROL.createUserControl
);
userRouter.get("/get_users", USER_CONTROL.getUsers);
userRouter.get("/session-status", getSessionStatus);

userRouter.get("/get_user/:id", USER_CONTROL.getUser);
userRouter.get("/me", verifyToken, USER_CONTROL.getMyProfile);
userRouter.get("/exist_user/:number", USER_CONTROL.getExistUser);
userRouter.post("/login", USER_CONTROL.login);
userRouter.post("/new_password_with_otp", USER_CONTROL.newPasswordWithOTP);
userRouter.get("/get_user/:user_id", USER_CONTROL.getUser);
userRouter.put(
  "/update_password",
  verifyToken,
  PasswordEncrypted(),
  USER_CONTROL.updatePassword
);
userRouter.put("/forget_password", USER_CONTROL.forgetPassword);

userRouter.put("/update_profile", verifyToken, USER_CONTROL.updateProfile);

userRouter.put("/update_address", verifyToken, USER_CONTROL.updateAddress);
userRouter.put(
  "/update_experiance",
  verifyToken,
  USER_CONTROL.updateExperiance
);
userRouter.post("/email_verify_send_otp", verifyToken, USER_CONTROL.sendOTP);
userRouter.post("/email_verify_otp", verifyToken, USER_CONTROL.verifyOTP);
export default userRouter;
