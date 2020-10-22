import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { validationResult } from "express-validator";

import { IValidationError } from "../validations/IValidationError";

interface IChechValidationResBody {
  status: string;
  validationErrors?: IValidationError[];
}

export const checkValidationResult: RequestHandler<ParamsDictionary, IChechValidationResBody> = (
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const myValidationResult = validationResult.withDefaults({
      formatter: (error) => {
        return {
          msg: error.msg,
          param: error.param
        };
      }
    });
    const newErrors = myValidationResult(req);
    return res.status(422).json({ status: "error", validationErrors: newErrors.array() });
  }
  next();
};
