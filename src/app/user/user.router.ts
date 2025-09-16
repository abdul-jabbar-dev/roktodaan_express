import Express from "express";
import USER_CONTROL from "./user.control";
import validatorMiddleware from "../../middleware/valibot";
import createUserSchema from "../../validators/createUser";
import PasswordEncrypted from "../../middleware/password_encrypted";
const userRouter = Express.Router();

userRouter.post(
  "/create_user",
  validatorMiddleware(createUserSchema),
  PasswordEncrypted(),
  USER_CONTROL.createUserControl
);
userRouter.get("/get_users", USER_CONTROL.getUsers);
userRouter.get("/me", USER_CONTROL.getMyProfile);
userRouter.get("/exist_user/:number", USER_CONTROL.getExistUser);
userRouter.get("/get_user/:user_id", USER_CONTROL.getUser);
userRouter.put(
  "/update_password",
  PasswordEncrypted(),
  USER_CONTROL.updatePassword
);
userRouter.put(
  "/update_profile", 
  USER_CONTROL.updateProfile
);

userRouter.put(
  "/update_address", 
  USER_CONTROL.updateAddress
);
userRouter.put(
  "/update_experiance", 
  USER_CONTROL.updateExperiance
);
userRouter.post(
  "/email_verify_send_otp", 
  USER_CONTROL.sendOTP
);
userRouter.post(
  "/email_verify_otp", 
  USER_CONTROL.verifyOTP
);
export default userRouter;
