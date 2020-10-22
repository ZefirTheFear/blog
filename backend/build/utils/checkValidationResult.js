"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidationResult = void 0;
var express_validator_1 = require("express-validator");
exports.checkValidationResult = function (req) {
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
        return newErrors.array();
    }
    else {
        return null;
    }
};
