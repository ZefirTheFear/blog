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
var checkValidationResult_1 = require("../middleware/checkValidationResult");
var isAuth_1 = require("./../middleware/isAuth");
var registerValidation_1 = require("../validations/registerValidation");
var loginValidation_1 = require("../validations/loginValidation");
var resetPasswordValidation_1 = require("../validations/resetPasswordValidation");
var userController = __importStar(require("../controllers/userController"));
var router = express_1.default.Router();
router.post("/register", registerValidation_1.registerValidation, checkValidationResult_1.checkValidationResult, userController.registerUser);
router.get("/activation/:userId/:hash", userController.activateUser);
router.post("/login", loginValidation_1.loginValidation, checkValidationResult_1.checkValidationResult, userController.loginUser);
router.get("/check-user", isAuth_1.isAuth, userController.checkUser);
router.patch("/reset-password", resetPasswordValidation_1.resetPasswordValidation, checkValidationResult_1.checkValidationResult, userController.resetPassword);
exports.default = router;
