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
        default: {
            url: "https://res.cloudinary.com/ztf/image/upload/v1573335637/social-news/avatars/default_avatar.png",
            public_id: null
        }
    },
    status: {
        type: String,
        default: UserStatus.user
    }
}, { timestamps: true });
// UserSchema.set("toJSON", {
//   transform: (_, ret) => {
//     delete ret.password;
//     return ret;
//   }
// });
exports.default = mongoose_1.model("User", UserSchema);
