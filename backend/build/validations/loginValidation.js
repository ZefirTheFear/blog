"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = void 0;
var express_validator_1 = require("express-validator");
exports.loginValidation = [
    express_validator_1.body("nickname")
        .isString()
        .withMessage("only a string")
        .isLength({ min: 1, max: 40 })
        .withMessage("from 5 to 40 chars"),
    express_validator_1.body("password")
        .isString()
        .withMessage("only a string")
        .isLength({ min: 5, max: 40 })
        .withMessage("from 5 to 40 chars")
        .not()
        .isLowercase()
        .withMessage("at least 1 capital symbol")
];
