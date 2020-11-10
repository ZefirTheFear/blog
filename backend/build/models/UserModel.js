"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserStatus;
(function (UserStatus) {
    UserStatus["user"] = "user";
    UserStatus["moderator"] = "moderator";
    UserStatus["admin"] = "admin";
})(UserStatus || (UserStatus = {}));
var UserSchema = new mongoose_1.Schema({
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        type: Object,
        required: true,
        default: {
            url: "https://res.cloudinary.com/ztf/image/upload/v1603398100/common/defaults/default-avatar.jpg",
            publicId: ""
        }
    },
    status: {
        type: String,
        required: true,
        default: UserStatus.user
    },
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
}, { timestamps: true });
// UserSchema.set("toJSON", {
//   transform: (_, ret) => {
//     delete ret.password;
//     return ret;
//   }
// });
exports.default = mongoose_1.model("User", UserSchema);
