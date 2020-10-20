import express from "express";

import registerValidation from "../validations/registerValidation";
import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/register", registerValidation, userController.registerUser);

export default router;
