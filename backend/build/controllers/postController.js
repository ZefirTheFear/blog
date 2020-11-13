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
exports.deletePost = exports.getPosts = exports.createPost = void 0;
var cloudinary_1 = require("cloudinary");
var deleteReqImages_1 = require("../utils/deleteReqImages");
// import { deleteImage } from "../utils/deleteImage";
var PostModel_1 = __importStar(require("../models/PostModel"));
var UserModel_1 = __importDefault(require("../models/UserModel"));
exports.createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, title, contentOrder, text, tags, images, postBody, _i, contentOrder_1, contentType, result, error_1, newPost, savedPost, error_2, user, error_3, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.userId;
                title = req.body.title;
                contentOrder = JSON.parse(req.body.contentOrder);
                text = JSON.parse(req.body.text);
                tags = JSON.parse(req.body.tags);
                images = req.files;
                postBody = [];
                _i = 0, contentOrder_1 = contentOrder;
                _a.label = 1;
            case 1:
                if (!(_i < contentOrder_1.length)) return [3 /*break*/, 8];
                contentType = contentOrder_1[_i];
                if (!(contentType === "text")) return [3 /*break*/, 2];
                postBody.push({
                    type: PostModel_1.PostBodyUnitTypes.text,
                    content: text[0]
                });
                text = text.slice(1, text.length);
                return [3 /*break*/, 7];
            case 2:
                if (!(contentType === "image")) return [3 /*break*/, 7];
                result = void 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, cloudinary_1.v2.uploader.upload(images[0].path, {
                        public_id: "blog/post-imgs/" + images[0].filename
                    })];
            case 4:
                result = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                deleteReqImages_1.deleteReqImages(req);
                return [2 /*return*/, res.status(500).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. some problems" }, error_1)
                    })];
            case 6:
                // deleteImage(images[0].path);
                postBody.push({
                    type: PostModel_1.PostBodyUnitTypes.image,
                    url: result.secure_url,
                    publicId: result.public_id
                });
                images = images.slice(1, images.length);
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8:
                deleteReqImages_1.deleteReqImages(req);
                newPost = new PostModel_1.default({
                    title: title,
                    body: postBody,
                    tags: tags,
                    creator: userId
                });
                _a.label = 9;
            case 9:
                _a.trys.push([9, 11, , 12]);
                return [4 /*yield*/, newPost.save()];
            case 10:
                savedPost = _a.sent();
                return [3 /*break*/, 12];
            case 11:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. post creating problem" }, error_2)
                    })];
            case 12:
                _a.trys.push([12, 14, , 15]);
                return [4 /*yield*/, UserModel_1.default.findById(userId)];
            case 13:
                user = _a.sent();
                return [3 /*break*/, 15];
            case 14:
                error_3 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_3) })];
            case 15:
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ status: "error", serverError: { customMsg: "user not found" } })];
                }
                user.posts.push(savedPost);
                _a.label = 16;
            case 16:
                _a.trys.push([16, 18, , 19]);
                return [4 /*yield*/, user.save()];
            case 17:
                _a.sent();
                return [3 /*break*/, 19];
            case 18:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. user updating problem" }, error_4)
                    })];
            case 19: return [2 /*return*/, res.status(201).json({ status: "success" })];
        }
    });
}); };
exports.getPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentPage, perPage, postsAmount, posts, error_5, lastPage, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentPage = parseInt(req.get("Page") || "1", 10);
                perPage = 2;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, PostModel_1.default.find().estimatedDocumentCount()];
            case 2:
                postsAmount = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_5) })];
            case 4:
                if (postsAmount === 0) {
                    posts = [];
                    return [2 /*return*/, res.json({ status: "success", posts: posts, lastPage: 1 })];
                }
                lastPage = Math.ceil(postsAmount / perPage);
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, PostModel_1.default.find()
                        .populate("creator", "nickname avatar")
                        .sort({ createdAt: -1 })
                        .skip((currentPage - 1) * perPage)
                        .limit(perPage)];
            case 6:
                posts = _a.sent();
                return [3 /*break*/, 8];
            case 7:
                error_6 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_6) })];
            case 8:
                if (!posts) {
                    posts = [];
                }
                return [2 /*return*/, res.json({ status: "success", posts: posts, lastPage: lastPage })];
        }
    });
}); };
exports.deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, userId, post, error_7, user, error_8, imagesArray, _i, _a, contentUnit, error_9, error_10, postCreator, error_11, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                postId = req.params.postId;
                userId = req.userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, PostModel_1.default.findById(postId)];
            case 2:
                post = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_7) })];
            case 4:
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ status: "error", serverError: { customMsg: "post not found" } })];
                }
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, UserModel_1.default.findById(userId)];
            case 6:
                user = _b.sent();
                return [3 /*break*/, 8];
            case 7:
                error_8 = _b.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_8) })];
            case 8:
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ status: "error", serverError: { customMsg: "user not found" } })];
                }
                if (user.status !== "admin" && post.creator !== userId) {
                    return [2 /*return*/, res.status(403).json({ status: "error", serverError: { customMsg: "u cant do it" } })];
                }
                imagesArray = [];
                for (_i = 0, _a = post.body; _i < _a.length; _i++) {
                    contentUnit = _a[_i];
                    if (contentUnit.type === "image") {
                        imagesArray.push(contentUnit.publicId);
                    }
                }
                if (!(imagesArray.length > 0)) return [3 /*break*/, 12];
                _b.label = 9;
            case 9:
                _b.trys.push([9, 11, , 12]);
                return [4 /*yield*/, cloudinary_1.v2.api.delete_resources(imagesArray)];
            case 10:
                _b.sent();
                return [3 /*break*/, 12];
            case 11:
                error_9 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. some problems" }, error_9)
                    })];
            case 12:
                _b.trys.push([12, 14, , 15]);
                return [4 /*yield*/, post.remove()];
            case 13:
                _b.sent();
                return [3 /*break*/, 15];
            case 14:
                error_10 = _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. post removing problem" }, error_10)
                    })];
            case 15:
                _b.trys.push([15, 17, , 18]);
                return [4 /*yield*/, UserModel_1.default.findById(post.creator)];
            case 16:
                postCreator = _b.sent();
                return [3 /*break*/, 18];
            case 17:
                error_11 = _b.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ status: "error", serverError: __assign({ customMsg: "bad request" }, error_11) })];
            case 18:
                if (!postCreator) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ status: "error", serverError: { customMsg: "postCreator not found" } })];
                }
                // const posts = postCreator.posts as Types.DocumentArray<IUser>;
                // const posts = postCreator.posts;
                // posts.pull(post._id);
                postCreator.posts.pull(post._id);
                _b.label = 19;
            case 19:
                _b.trys.push([19, 21, , 22]);
                return [4 /*yield*/, postCreator.save()];
            case 20:
                _b.sent();
                return [3 /*break*/, 22];
            case 21:
                error_12 = _b.sent();
                return [2 /*return*/, res.status(503).json({
                        status: "error",
                        serverError: __assign({ customMsg: "oops. user updating problem" }, error_12)
                    })];
            case 22: return [2 /*return*/, res.json({ status: "success" })];
        }
    });
}); };
