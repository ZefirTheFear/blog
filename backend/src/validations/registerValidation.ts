import { body } from "express-validator";

import User from "../models/UserModel";

export const registerValidation = [
  body("nickname")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 1, max: 40 })
    .withMessage("from 5 to 40 chars")
    .custom(async (value: string) => {
      const user = await User.findOne({
        nickname: { $regex: new RegExp("^" + value + "$", "i") }
      });
      if (user) {
        return Promise.reject("a user with such nickname already exists");
      }
    }),
  body("email")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 5, max: 50 })
    .withMessage("from 5 to 50 chars")
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter valid email")
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("a user with such email already exists");
      }
    }),
  body("password")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 5, max: 40 })
    .withMessage("from 5 to 40 chars")
    .not()
    .isLowercase()
    .withMessage("at least 1 capital symbol"),
  body("confirmPassword").custom((value: string, { req }) => {
    if (value !== req.body.password) {
      // throw new Error("the password must match");
      return Promise.reject("the password must match");
    }
    return true;
  })
];
