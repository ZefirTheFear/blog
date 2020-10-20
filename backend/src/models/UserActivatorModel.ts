import { Schema, Document, model } from "mongoose";

import { IUser } from "./UserModel";

export interface IUserActivator extends Document {
  userId: IUser["_id"];
  hash: string;
}

const userActivatorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default model<IUserActivator>("UserActivator", userActivatorSchema);
