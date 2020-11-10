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
    res.status(401).json({ status: "error", serverError: { customMsg: "auth failed" } });
    return;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(jwtToken, process.env.JWT_KEY as jwt.Secret) as jwtPayload;
  } catch (error) {
    res.status(403).json({ status: "error", serverError: { customMsg: "auth failed", ...error } });
    return;
  }
  // req.body.userId = decodedToken.userId;
  // req["userId"] = decodedToken.userId;
  req.userId = decodedToken.userId;
  next();
};
