"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = void 0;
var fs_1 = __importDefault(require("fs"));
// import path from "path";
exports.deleteImage = function (filePath) {
    // filePath = path.join(__dirname, "..", filePath);
    fs_1.default.unlink(filePath, function (err) {
        if (err) {
            console.log(err);
        }
    });
};
