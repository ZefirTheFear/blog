import { body } from "express-validator";

export const loginValidation = [
  body("nickname")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 1, max: 40 })
    .withMessage("from 5 to 40 chars"),
  body("password")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 5, max: 40 })
    .withMessage("from 5 to 40 chars")
    .not()
    .isLowercase()
    .withMessage("at least 1 capital symbol")
];
