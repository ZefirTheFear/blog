"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidationResult = void 0;
var express_validator_1 = require("express-validator");
var deleteReqImages_1 = require("../utils/deleteReqImages");
exports.checkValidationResult = function (req, res, next) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        var myValidationResult = express_validator_1.validationResult.withDefaults({
            formatter: function (error) {
                return {
                    msg: error.msg,
                    param: error.param
                };
            }
        });
        var newErrors = myValidationResult(req);
        deleteReqImages_1.deleteReqImages(req);
        return res.status(422).json({ status: "error", validationErrors: newErrors.array() });
    }
    next();
};
