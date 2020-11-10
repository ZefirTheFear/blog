import path from "path";
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "../images")),
  filename: (_req, file, cb) => cb(null, `${Date.now().toString()}-${file.originalname}`)
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadImages = multer({ storage, fileFilter }).array("images");
