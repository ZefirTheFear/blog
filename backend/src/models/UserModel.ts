import { Schema, model, Document } from "mongoose";

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
  avatar: string;
  status: UserStatus;
}

const UserSchema = new Schema(
  {
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
      required: true
    },
    avatar: {
      type: Object,
      default: {
        url:
          "https://res.cloudinary.com/ztf/image/upload/v1573335637/social-news/avatars/default_avatar.png",
        public_id: null
      }
    },
    status: {
      type: String,
      default: UserStatus.user
    }
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
