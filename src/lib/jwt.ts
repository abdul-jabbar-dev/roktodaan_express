import * as jwt from "jsonwebtoken";

const GenToken = (data: any) => {
  return jwt.sign(data, process.env.SECRET_KEY as string);
};

const DecToken = (token:string) => {
  return jwt.verify(token, process.env.SECRET_KEY as string);
};

const JWT = { GenToken,DecToken };
export default JWT;
