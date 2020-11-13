import { Schema, Document, model } from "mongoose";

import { IUser } from "./UserModel";

export enum PostBodyUnitTypes {
  text = "text",
  image = "image"
}

interface ITextPostBodyUnit {
  type: PostBodyUnitTypes.text;
  content: string;
}
interface IImagePostBodyUnit {
  type: PostBodyUnitTypes.image;
  url: string;
  publicId: string;
}

export type PostBodyUnit = ITextPostBodyUnit | IImagePostBodyUnit;

export interface IPost extends Document {
  title: string;
  body: PostBodyUnit[];
  creator: IUser["_id"];
  // creator: Schema.Types.ObjectId;
  tags: string[];
}

const PostSchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tags: [
      {
        type: String,
        required: true
      }
    ]
  },
  { timestamps: true }
);

export default model<IPost>("Post", PostSchema);
