"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReqImages = void 0;
var fs_1 = __importDefault(require("fs"));
exports.deleteReqImages = function (req) {
    var images = req.files;
    if (images.length > 0) {
        for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
            var image = images_1[_i];
            fs_1.default.unlink(image.path, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
};
