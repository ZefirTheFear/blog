import { body } from "express-validator";

export const resetPasswordValidation = [
  body("nickname")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 1, max: 40 })
    .withMessage("from 5 to 40 chars"),
  body("email")
    .isString()
    .withMessage("only a string")
    .isLength({ min: 5, max: 50 })
    .withMessage("from 5 to 50 chars")
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter valid email")
];
