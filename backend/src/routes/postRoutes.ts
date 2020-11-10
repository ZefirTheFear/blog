import express from "express";
// import multer, { FileFilterCallback } from "multer";

import { isAuth } from "./../middleware/isAuth";
import { uploadImages } from "./../middleware/uploadImages";

import * as postController from "../controllers/postController";

const router = express.Router();

// ------ multer --------
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, "images"),
//   filename: (_req, file, cb) => cb(null, Date.now().toString() + file.originalname)
// });

// const fileFilter = (_req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const uploadImages = multer({ storage, fileFilter }).array("images");
// ----------------------

router.post("/create-post", isAuth, uploadImages, postController.createPost);

export default router;
