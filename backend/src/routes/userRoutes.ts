import express from "express";

import { checkValidationResult } from "../middleware/checkValidationResult";

import { registerValidation } from "../validations/registerValidation";
import { loginValidation } from "./../validations/loginValidation";
import * as userController from "../controllers/userController";
import { isAuth } from "./../middleware/isAuth";

const router = express.Router();

router.post("/register", registerValidation, checkValidationResult, userController.registerUser);

router.get("/activation/:userId/:hash", userController.activateUser);

router.post("/login", loginValidation, checkValidationResult, userController.loginUser);

router.get("/check-user", isAuth, userController.checkUser);

export default router;
