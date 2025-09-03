import { RequestHandler } from "express";
import getPasswordFromObject, {
  setPasswordInStringPath,
} from "../utils/getPassword";
import { hashedPassword } from "../lib/bycrypt";

const PasswordEncrypted = (): RequestHandler => (req, res, next) => {
  try {
    const [path, password] = getPasswordFromObject(req.body);

    const hashedPass = hashedPassword(password);

    if (hashedPass && typeof hashedPass === "string") {
      req.body = setPasswordInStringPath(req.body, path, hashedPass);
    }

    next();
  } catch (error) {
    return next(error);
  }
};

export default PasswordEncrypted;
