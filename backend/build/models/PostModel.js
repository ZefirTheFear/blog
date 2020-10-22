"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PostBodyUnitTypes;
(function (PostBodyUnitTypes) {
    PostBodyUnitTypes["text"] = "text";
    PostBodyUnitTypes["image"] = "image";
})(PostBodyUnitTypes || (PostBodyUnitTypes = {}));
var PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    body: [
        {
            type: Object,
            required: true
        }
    ],
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });
exports.default = mongoose_1.model("Post", PostSchema);
