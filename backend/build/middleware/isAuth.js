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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.isAuth = function (req, res, next) {
    // export const isAuth: RequestHandler<IIsAuthParams, IIsAuthResBody> = (req, res, next) => {
    var jwtToken = req.get("Authorization");
    if (!jwtToken) {
        res.status(401).json({ status: "error", serverError: { customMsg: "auth failed" } });
        return;
    }
    var decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_KEY);
    }
    catch (error) {
        res.status(403).json({ status: "error", serverError: __assign({ customMsg: "auth failed" }, error) });
        return;
    }
    req.userId = decodedToken.userId;
    next();
};
