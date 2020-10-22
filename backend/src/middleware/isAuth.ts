import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import jwt from "jsonwebtoken";

import { jwtPayload } from "./../models/jwtPayload";

interface IIsAuthResBody {
  status: string;
  serverError?: { customMsg: string };
}

export const isAuth: RequestHandler<ParamsDictionary, IIsAuthResBody> = (req, res, next) => {
  const jwtToken = req.get("Authorization");
  if (!jwtToken) {
    return res.status(401).json({ status: "error", serverError: { customMsg: "auth failed" } });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(jwtToken, process.env.JWT_KEY as jwt.Secret) as jwtPayload;
  } catch (error) {
    return res
      .status(403)
      .json({ status: "error", serverError: { customMsg: "auth failed", ...error } });
  }
  req.body.userId = decodedToken.userId;
  next();
};
