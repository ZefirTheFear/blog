"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFormData = void 0;
var path_1 = __importDefault(require("path"));
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) { return cb(null, path_1.default.join(__dirname, "../images")); },
    filename: function (_req, file, cb) { return cb(null, Date.now().toString() + "-" + file.originalname); }
});
var fileFilter = function (_req, file, cb) {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.uploadFormData = multer_1.default({ storage: storage, fileFilter: fileFilter }).array("images");
