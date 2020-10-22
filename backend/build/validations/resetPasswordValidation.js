"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = void 0;
var express_validator_1 = require("express-validator");
exports.resetPasswordValidation = [
    express_validator_1.body("nickname")
        .isString()
        .withMessage("only a string")
        .isLength({ min: 1, max: 40 })
        .withMessage("from 5 to 40 chars"),
    express_validator_1.body("email")
        .isString()
        .withMessage("only a string")
        .isLength({ min: 5, max: 50 })
        .withMessage("from 5 to 50 chars")
        .normalizeEmail()
        .isEmail()
        .withMessage("Enter valid email")
];
