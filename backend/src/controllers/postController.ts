import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

import { deleteReqImages } from "../utils/deleteReqImages";
// import { deleteImage } from "../utils/deleteImage";

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
        deleteReqImages(req);
        return res.status(500).json({
          status: "error",
          serverError: { customMsg: "oops. some problems", ...error }
        });
      }
      // deleteImage(images[0].path);
      postBody.push({
        type: PostBodyUnitTypes.image,
        url: result.secure_url,
        publicId: result.public_id
      });
      images = images.slice(1, images.length);
    }
  }
  deleteReqImages(req);

  // const nP = await Post.create({t})

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

interface IGetPostsResponseBody {
  status: string;
  lastPage?: number;
  posts?: IPost[];
  serverError?: { customMsg: string };
}
export const getPosts: RequestHandler<ParamsDictionary, IGetPostsResponseBody> = async (
  req,
  res
) => {
  const currentPage = parseInt(req.get("Page") || "1", 10);
  const perPage = 2;

  let postsAmount: number;
  let posts: IPost[] | null;

  try {
    postsAmount = await Post.find().estimatedDocumentCount();
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (postsAmount === 0) {
    posts = [];
    return res.json({ status: "success", posts, lastPage: 1 });
  }
  const lastPage = Math.ceil(postsAmount / perPage);

  try {
    posts = await Post.find()
      .populate("creator", "nickname avatar")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!posts) {
    posts = [];
  }

  return res.json({ status: "success", posts, lastPage });
};

interface IDeletePostParams extends ParamsDictionary {
  postId: string;
}
interface IDeletePostResponseBody {
  status: string;
  serverError?: { customMsg: string };
  data?: unknown;
}
export const deletePost: RequestHandler<IDeletePostParams, IDeletePostResponseBody> = async (
  req,
  res
) => {
  const postId = req.params.postId;
  const userId = req.userId;

  let post: IPost | null;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!post) {
    return res.status(404).json({ status: "error", serverError: { customMsg: "post not found" } });
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
  if (user.status !== "admin" && post.creator !== userId) {
    return res.status(403).json({ status: "error", serverError: { customMsg: "u cant do it" } });
  }

  const imagesArray: string[] = [];
  for (const contentUnit of post.body) {
    if (contentUnit.type === "image") {
      imagesArray.push(contentUnit.publicId);
    }
  }
  if (imagesArray.length > 0) {
    try {
      await cloudinary.api.delete_resources(imagesArray);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        serverError: { customMsg: "oops. some problems", ...error }
      });
    }
  }

  try {
    await post.remove();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. post removing problem", ...error }
    });
  }

  let postCreator: IUser | null;
  try {
    postCreator = await User.findById(post.creator);
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!postCreator) {
    return res
      .status(404)
      .json({ status: "error", serverError: { customMsg: "postCreator not found" } });
  }

  // const posts = postCreator.posts as Types.DocumentArray<IUser>;
  // const posts = postCreator.posts;
  // posts.pull(post._id);

  postCreator.posts.pull(post._id);
  try {
    await postCreator.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. user updating problem", ...error }
    });
  }

  return res.json({ status: "success" });
};
