"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// import multer, { FileFilterCallback } from "multer";
var isAuth_1 = require("./../middleware/isAuth");
var uploadImages_1 = require("./../middleware/uploadImages");
var postController = __importStar(require("../controllers/postController"));
var router = express_1.default.Router();
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
router.post("/create-post", isAuth_1.isAuth, uploadImages_1.uploadImages, postController.createPost);
exports.default = router;
