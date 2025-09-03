import Express from "express";
import USER_CONTROL from "./user.control";
import validatorMiddleware from "../../middleware/valibot";
import createUserSchema from "../../validators/createUser";
import PasswordEncrypted from "../../middleware/password_encrypted";
const userRouter = Express.Router();

userRouter.post(
  "/create_user",
  validatorMiddleware(createUserSchema),PasswordEncrypted(),
  USER_CONTROL.createUserControl
);
userRouter.get("/get_users", USER_CONTROL.getUsers);
userRouter.get("/get_user/:user_id", USER_CONTROL.getUser);
export default userRouter;
