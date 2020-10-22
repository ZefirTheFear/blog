import express from "express";

import { checkValidationResult } from "../middleware/checkValidationResult";
import { isAuth } from "./../middleware/isAuth";

import { registerValidation } from "../validations/registerValidation";
import { loginValidation } from "../validations/loginValidation";
import { resetPasswordValidation } from "../validations/resetPasswordValidation";

import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/register", registerValidation, checkValidationResult, userController.registerUser);

router.get("/activation/:userId/:hash", userController.activateUser);

router.post("/login", loginValidation, checkValidationResult, userController.loginUser);

router.get("/check-user", isAuth, userController.checkUser);

router.patch(
  "/reset-password",
  resetPasswordValidation,
  checkValidationResult,
  userController.resetPassword
);

export default router;
