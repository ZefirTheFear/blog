import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

import { deleteImage } from "../utils/deleteImage";

import Post, { PostBodyUnit, PostBodyUnitTypes, IPost } from "../models/PostModel";
import User, { IUser } from "../models/UserModel";

interface ICreatePostRequestBody {
  title: string;
  text: string;
  contentOrder: string;
  tags: string;
}
interface ICreatePostResponseBody {
  status: string;
  serverError?: { customMsg: string };
}
export const createPost: RequestHandler<
  ParamsDictionary,
  ICreatePostResponseBody,
  ICreatePostRequestBody
> = async (req, res) => {
  // TODO Validation
  // console.log("body", req.body);
  // console.log("files", req.files);
  // return;
  const userId = req.userId;
  const { title } = req.body;
  const contentOrder: ("text" | "image")[] = JSON.parse(req.body.contentOrder);
  let text: string[] = JSON.parse(req.body.text);
  const tags: string[] = JSON.parse(req.body.tags);

  let images = req.files as Express.Multer.File[];

  const postBody: PostBodyUnit[] = [];
  for (const contentType of contentOrder) {
    if (contentType === "text") {
      postBody.push({
        type: PostBodyUnitTypes.text,
        content: text[0]
      });
      text = text.slice(1, text.length);
    } else if (contentType === "image") {
      let result: UploadApiResponse;
      try {
        result = await cloudinary.uploader.upload(images[0].path, {
          public_id: `blog/post-imgs/${images[0].filename}`
        });
      } catch (error) {
        deleteImage(images[0].path);
        return res.json({
          status: "error",
          serverError: { customMsg: "oops. some problems", ...error }
        });
      }
      deleteImage(images[0].path);
      postBody.push({
        type: PostBodyUnitTypes.image,
        url: result.secure_url,
        publicId: result.public_id
      });
      images = images.slice(1, images.length);
    }
  }

  const newPost = new Post({
    title,
    body: postBody,
    tags,
    creator: userId
  } as IPost);

  let savedPost: IPost;
  try {
    savedPost = await newPost.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. post creating problem", ...error }
    });
  }

  let user: IUser | null;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!user) {
    return res.status(404).json({ status: "error", serverError: { customMsg: "user not found" } });
  }
  user.posts.push(savedPost);

  try {
    await user.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. user updating problem", ...error }
    });
  }

  return res.status(201).json({ status: "success" });
};