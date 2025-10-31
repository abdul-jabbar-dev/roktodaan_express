import * as jwt from "jsonwebtoken";

const GenToken = (data: jwt.JwtPayload | string | Buffer,  options?:jwt.SignOptions) => {
  const secret: jwt.Secret = process.env.SECRET_KEY as jwt.Secret;
  return jwt.sign(data, secret, options);
};

const DecToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET_KEY as jwt.Secret);
};

const JWT = { GenToken, DecToken };
export default JWT;
