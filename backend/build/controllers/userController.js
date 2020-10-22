"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.checkUser = exports.loginUser = exports.activateUser = exports.registerUser = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var uuid_1 = require("uuid");
var path_1 = __importDefault(require("path"));
var ejs_1 = __importDefault(require("ejs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mailer_1 = __importDefault(require("../core/mailer"));
var UserModel_1 = __importDefault(require("../models/UserModel"));
var UserActivatorModel_1 = __importDefault(require("../models/UserActivatorModel"));
exports.registerUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nickname, email, password, hashedPassword, error_1, newUser, savedUser, error_2, hash, newUserActivator, savedUserActivator, error_3, emailTemplate, error_4, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, nickname = _a.nickname, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
            case 2:
                hashedPassword = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                return [2 /*return*/, res
                        .status(500)
                        .json({ status: "error", serverError: __assign({ customMsg: "oops. some problems" }, error_1) })];
            case 4:
                newUser = new UserModel_1.default({ nickname: nickname, email: email, password: hashedPassword });
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, newUser.save()];
            case 6:
                savedUser = _b.sent();
                return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. user creating problem" }, error_2)
                    })];
            case 8:
                hash = uuid_1.v4();
                newUserActivator = new UserActivatorModel_1.default({
                    userId: savedUser._id,
                    hash: hash
                });
                _b.label = 9;
            case 9:
                _b.trys.push([9, 11, , 13]);
                return [4 /*yield*/, newUserActivator.save()];
            case 10:
                savedUserActivator = _b.sent();
                return [3 /*break*/, 13];
            case 11:
                error_3 = _b.sent();
                return [4 /*yield*/, savedUser.remove()];
            case 12:
                _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. user activator creating problem" }, error_3)
                    })];
            case 13:
                _b.trys.push([13, 15, , 18]);
                return [4 /*yield*/, ejs_1.default.renderFile(path_1.default.join(__dirname, "../views/register.ejs"), {
                        nickname: nickname,
                        port: process.env.PORT,
                        userId: savedUser._id,
                        hash: hash
                    })];
            case 14:
                emailTemplate = _b.sent();
                return [3 /*break*/, 18];
            case 15:
                error_4 = _b.sent();
                return [4 /*yield*/, savedUser.remove()];
            case 16:
                _b.sent();
                return [4 /*yield*/, savedUserActivator.remove()];
            case 17:
                _b.sent();
                return [2 /*return*/, res.status(500).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. emailTemplate creating problem" }, error_4)
                    })];
            case 18:
                _b.trys.push([18, 20, , 23]);
                return [4 /*yield*/, mailer_1.default.sendMail({
                        // to: email,
                        to: "z4clr07.gaming@gmail.com",
                        from: "'blog.com' <support@blog.com>",
                        subject: "Successful Register",
                        html: emailTemplate
                    })];
            case 19:
                _b.sent();
                return [3 /*break*/, 23];
            case 20:
                error_5 = _b.sent();
                return [4 /*yield*/, savedUser.remove()];
            case 21:
                _b.sent();
                return [4 /*yield*/, savedUserActivator.remove()];
            case 22:
                _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. email sending problem" }, error_5)
                    })];
            case 23: return [2 /*return*/, res.status(201).json({ status: "success" })];
        }
    });
}); };
exports.activateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, hash, activation, error_6, user, error_7, error_8, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                hash = req.params.hash;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, UserActivatorModel_1.default.findOne({ userId: userId, hash: hash })];
            case 2:
                activation = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_6) })];
            case 4:
                if (!activation) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ status: "error", serverError: { customMsg: "actiovation not found" } })];
                }
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, UserModel_1.default.findById(userId)];
            case 6:
                user = _a.sent();
                return [3 /*break*/, 8];
            case 7:
                error_7 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_7) })];
            case 8:
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ status: "error", serverError: { customMsg: "user not found" } })];
                }
                user.isActive = true;
                _a.label = 9;
            case 9:
                _a.trys.push([9, 11, , 12]);
                return [4 /*yield*/, user.save()];
            case 10:
                _a.sent();
                return [3 /*break*/, 12];
            case 11:
                error_8 = _a.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. user updating problem" }, error_8)
                    })];
            case 12:
                _a.trys.push([12, 14, , 15]);
                return [4 /*yield*/, activation.remove()];
            case 13:
                _a.sent();
                return [3 /*break*/, 15];
            case 14:
                error_9 = _a.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. userActivator removing problem" }, error_9)
                    })];
            case 15: return [2 /*return*/, (res
                    .status(200)
                    // .redirect("http://localhost:3000")
                    // .json({ status: "success" })
                    .send("<script>window.close()</script>"))];
        }
    });
}); };
exports.loginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nickname, password, user, error_10, result, payload, token, jsonUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, nickname = _a.nickname, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, UserModel_1.default.findOne({ nickname: nickname }).select("+password")];
            case 2:
                user = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_10 = _b.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_10) })];
            case 4:
                if (!user) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ status: "error", validationErrors: [{ param: "nickname", msg: "user not found" }] })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 5:
                result = _b.sent();
                if (!result) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ status: "error", validationErrors: [{ param: "password", msg: "wrong password" }] })];
                }
                if (!user.isActive) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            validationErrors: [{ param: "nickname", msg: "please activate user" }]
                        })];
                }
                payload = { userId: user._id };
                token = jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, {
                    expiresIn: 24 * 3600
                });
                jsonUser = user.toJSON();
                if (jsonUser.password) {
                    delete jsonUser.password;
                }
                return [2 /*return*/, res
                        .status(200)
                        .json({ status: "success", jwtToken: token, user: jsonUser, expiresInMs: 24 * 3600 * 1000 })];
        }
    });
}); };
exports.checkUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, UserModel_1.default.findById(userId)];
            case 2:
                user = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_11) })];
            case 4:
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ status: "error", serverError: { customMsg: "user not found" } })];
                }
                return [2 /*return*/, res.json({ status: "success", user: user })];
        }
    });
}); };
exports.resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nickname, email, user, error_12, newPassword, hashedPassword, error_13, emailTemplate, error_14, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, nickname = _a.nickname, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, UserModel_1.default.findOne({ nickname: nickname, email: email })];
            case 2:
                user = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_12 = _b.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_12) })];
            case 4:
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            status: "error",
                            validationErrors: [
                                { param: "nickname", msg: "user not found" },
                                { param: "email", msg: "user not found" }
                            ]
                        })];
                }
                newPassword = "NP" + uuid_1.v4().slice(0, 8);
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 12)];
            case 5:
                hashedPassword = _b.sent();
                user.password = hashedPassword;
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, user.save()];
            case 7:
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                error_13 = _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. user updating problem" }, error_13)
                    })];
            case 9:
                _b.trys.push([9, 11, , 12]);
                return [4 /*yield*/, ejs_1.default.renderFile(path_1.default.join(__dirname, "../views/resetPassword.ejs"), {
                        nickname: nickname,
                        newPassword: newPassword
                    })];
            case 10:
                emailTemplate = _b.sent();
                return [3 /*break*/, 12];
            case 11:
                error_14 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. emailTemplate creating problem" }, error_14)
                    })];
            case 12:
                _b.trys.push([12, 14, , 15]);
                return [4 /*yield*/, mailer_1.default.sendMail({
                        // to: email,
                        to: "z4clr07.gaming@gmail.com",
                        from: "'blog.com' <support@blog.com>",
                        subject: "New Password",
                        html: emailTemplate
                    })];
            case 13:
                _b.sent();
                return [3 /*break*/, 15];
            case 14:
                error_15 = _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. email sending problem" }, error_15)
                    })];
            case 15: return [2 /*return*/, res.status(200).json({ status: "success" })];
        }
    });
}); };
