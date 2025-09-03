import bcrypt from "bcryptjs";
export const hashedPassword = (plainText: string) => {
  return bcrypt.hashSync("B4c0//", process.env.SOLT);
};
