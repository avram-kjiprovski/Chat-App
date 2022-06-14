import { IUser } from "@/interfaces";
import jwt from "jsonwebtoken";


export class JWTService {
  constructor() {}

  createToken = (username: IUser) => {
    const newToken = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRATION_TIME,
    });

    return newToken;
  };

  decodeToken = (token: string) => {
    return jwt.decode(token);
  };

  jwtMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Missing valid header",
      });
    }

    const [, token] = authorization.split(" ");

    try {
      jwt.verify(token, process.env.SECRET_KEY);
      return next();
    } catch (error) {
      return res.status(401).json(error);
    }
  };
}
