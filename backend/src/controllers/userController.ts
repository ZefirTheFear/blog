import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";

import { jwtPayload } from "./../models/jwtPayload";

import transporter from "../core/mailer";

import User, { IUser } from "../models/UserModel";
import UserActivator, { IUserActivator } from "../models/UserActivatorModel";
import { IValidationError } from "./../validations/IValidationError";

interface IRegisterUserRequestBody {
  nickname: string;
  email: string;
  password: string;
}
interface IRegisterUserResponseBody {
  status: string;
  serverError?: { customMsg: string };
}
export const registerUser: RequestHandler<
  ParamsDictionary,
  IRegisterUserResponseBody,
  IRegisterUserRequestBody
> = async (req, res) => {
  const { nickname, email, password } = req.body;

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", serverError: { customMsg: "oops. some problems", ...error } });
  }

  const newUser = new User({ nickname, email, password: hashedPassword } as IUser);
  let savedUser: IUser;
  try {
    savedUser = await newUser.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. user creating problem", ...error }
    });
  }

  const hash = uuid();
  const newUserActivator = new UserActivator({
    userId: savedUser._id,
    hash: hash
  });
  let savedUserActivator: IUserActivator;
  try {
    savedUserActivator = await newUserActivator.save();
  } catch (error) {
    await savedUser.remove();
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. user activator creating problem", ...error }
    });
  }

  let emailTemplate: string;
  try {
    emailTemplate = await ejs.renderFile(path.join(__dirname, "../views/register.ejs"), {
      nickname,
      port: process.env.PORT,
      userId: savedUser._id,
      hash
    });
  } catch (error) {
    await savedUser.remove();
    await savedUserActivator.remove();
    return res.status(500).json({
      status: "error",
      serverError: { customMsg: "oops. emailTemplate creating problem", ...error }
    });
  }

  try {
    await transporter.sendMail({
      // to: email,
      to: "z4clr07.gaming@gmail.com",
      from: "'blog.com' <support@blog.com>",
      subject: "Successful Register",
      html: emailTemplate
    });
  } catch (error) {
    await savedUser.remove();
    await savedUserActivator.remove();
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. email sending problem", ...error }
    });
  }

  return res.status(201).json({ status: "success" });
};

interface IActivateUserParams {
  userId: string;
  hash: string;
}
interface IActivateUserResponseBody {
  status?: string;
  serverError?: { customMsg: string };
}
export const activateUser: RequestHandler<
  IActivateUserParams,
  IActivateUserResponseBody | string
> = async (req, res) => {
  const userId = req.params.userId;
  const hash = req.params.hash;

  let activation: IUserActivator | null;
  try {
    activation = await UserActivator.findOne({ userId, hash });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!activation) {
    return res
      .status(404)
      .json({ status: "error", serverError: { customMsg: "actiovation not found" } });
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

  user.isActive = true;
  try {
    await user.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. user updating problem", ...error }
    });
  }

  try {
    await activation.remove();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. userActivator removing problem", ...error }
    });
  }
  return (
    res
      .status(200)
      // .redirect("http://localhost:3000")
      // .json({ status: "success" })
      .send("<script>window.close()</script>")
  );
};

interface ILoginUserRequestBody {
  nickname: string;
  password: string;
}
interface ILoginUserResponseBody {
  status: string;
  jwtToken?: string;
  user?: IUser;
  expiresInMs?: number;
  serverError?: { customMsg: string };
  validationErrors?: IValidationError[];
}
export const loginUser: RequestHandler<
  ParamsDictionary,
  ILoginUserResponseBody,
  ILoginUserRequestBody
> = async (req, res) => {
  const { nickname, password } = req.body;

  let user: IUser | null;
  try {
    user = await User.findOne({ nickname }).select("+password");
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", validationErrors: [{ param: "nickname", msg: "user not found" }] });
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res
      .status(403)
      .json({ status: "error", validationErrors: [{ param: "password", msg: "wrong password" }] });
  }

  if (!user.isActive) {
    return res.status(400).json({
      status: "error",
      validationErrors: [{ param: "nickname", msg: "please activate user" }]
    });
  }

  const expiresInSec = 7 * 24 * 3600;
  const payload: jwtPayload = { userId: user._id };
  const token = jwt.sign(payload, process.env.JWT_KEY as jwt.Secret, {
    expiresIn: expiresInSec
  });

  const jsonUser = user.toJSON();
  if (jsonUser.password) {
    delete jsonUser.password;
  }
  return res
    .status(200)
    .json({ status: "success", jwtToken: token, user: jsonUser, expiresInMs: expiresInSec * 1000 });
};

interface ICheckUserRequestBody {
  nickname: string;
  password: string;
  // userId: string;
}
interface ICheckUserResponseBody {
  status: string;
  jwtToken?: string;
  user?: IUser;
  expiresInMs?: number;
  serverError?: { customMsg: string };
  validationErrors?: IValidationError[];
}
export const checkUser: RequestHandler<
  ParamsDictionary,
  ICheckUserResponseBody,
  ICheckUserRequestBody
> = async (req, res) => {
  const userId = req.userId;

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
  return res.json({ status: "success", user });
};

interface IResetPasswordRequestBody {
  nickname: string;
  email: string;
}
interface IResetPasswordResponseBody {
  status: string;
  serverError?: { customMsg: string };
  validationErrors?: IValidationError[];
}
export const resetPassword: RequestHandler<
  ParamsDictionary,
  IResetPasswordResponseBody,
  IResetPasswordRequestBody
> = async (req, res) => {
  const { nickname, email } = req.body;

  let user: IUser | null;
  try {
    user = await User.findOne({ nickname, email });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", serverError: { customMsg: "bad request", ...error } });
  }
  if (!user) {
    return res.status(404).json({
      status: "error",
      validationErrors: [
        { param: "nickname", msg: "user not found" },
        { param: "email", msg: "user not found" }
      ]
    });
  }

  const newPassword = `NP${uuid().slice(0, 8)}`;
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  try {
    await user.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. user updating problem", ...error }
    });
  }

  let emailTemplate: string;
  try {
    emailTemplate = await ejs.renderFile(path.join(__dirname, "../views/resetPassword.ejs"), {
      nickname,
      newPassword
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      serverError: { customMsg: "oops. emailTemplate creating problem", ...error }
    });
  }

  try {
    await transporter.sendMail({
      // to: email,
      to: "z4clr07.gaming@gmail.com",
      from: "'blog.com' <support@blog.com>",
      subject: "New Password",
      html: emailTemplate
    });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { customMsg: "oops. email sending problem", ...error }
    });
  }

  return res.status(200).json({ status: "success" });
};
