import bcrypt from "bcryptjs";
export const hashedPassword = (plainText: string) => {
  return bcrypt.hashSync(plainText, Number(process.env.SALT)||15 );
};
export const comparePassword = (plainText: string, hashedPassword: string) => {
  return bcrypt.compareSync(plainText, hashedPassword);
};
