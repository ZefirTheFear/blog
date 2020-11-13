import { Schema, model, Document, Types } from "mongoose";

import { IPost } from "./PostModel";

enum UserStatus {
  user = "user",
  moderator = "moderator",
  admin = "admin"
}

export interface IUser extends Document {
  isActive: boolean;
  nickname: string;
  email: string;
  password: string;
  avatar: { url: string; publicId: string };
  status: UserStatus;
  posts: Types.DocumentArray<IPost>;
  // posts: IPost["_id"][];
  // posts: Schema.Types.ObjectId[];
}

const UserSchema = new Schema(
  {
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
        url:
          "https://res.cloudinary.com/ztf/image/upload/v1603398100/common/defaults/default-avatar.jpg",
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
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  { timestamps: true }
);

// UserSchema.set("toJSON", {
//   transform: (_, ret) => {
//     delete ret.password;
//     return ret;
//   }
// });

export default model<IUser>("User", UserSchema);
