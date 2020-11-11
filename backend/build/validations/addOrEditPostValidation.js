"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrEditPostValidation = void 0;
var express_validator_1 = require("express-validator");
exports.addOrEditPostValidation = [
    express_validator_1.check("title")
        .isString()
        .withMessage("only a string")
        .isLength({ min: 1, max: 50 })
        .withMessage("from 1 to 50 symbols"),
    express_validator_1.check("contentOrder").custom(function (value) {
        var content = JSON.parse(value);
        if (content.length < 1 || content.length > 8) {
            throw new Error("from 1 to 8 content units");
        }
        return true;
    }),
    express_validator_1.check("tags").custom(function (value) {
        var tags = JSON.parse(value);
        if (tags.length < 1 || tags.length > 8) {
            throw new Error("from 1 to 8 tags");
        }
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            if (tag.length > 40) {
                throw new Error("from 1 to 40 symbols in tag");
            }
        }
        return true;
    })
];
