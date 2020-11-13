import express from "express";

import { isAuth } from "./../middleware/isAuth";
import { addOrEditPostValidation } from "./../validations/addOrEditPostValidation";
import { checkValidationResult } from "./../middleware/checkValidationResult";
import { uploadFormData } from "../middleware/uploadFormData";

import * as postController from "../controllers/postController";

const router = express.Router();

router.post(
  "/create-post",
  isAuth,
  uploadFormData,
  addOrEditPostValidation,
  checkValidationResult,
  postController.createPost
);

router.get("/get-posts", postController.getPosts);

router.delete("/delete-post/:postId", isAuth, postController.deletePost);

export default router;
