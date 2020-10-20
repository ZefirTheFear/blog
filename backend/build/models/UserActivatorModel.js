"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userActivatorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model("UserActivator", userActivatorSchema);
