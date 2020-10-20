import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import path from "path";
import ejs from "ejs";

import transporter from "../core/mailer";

import { IValidationError } from "../validations/IValidationError";
import User, { IUser } from "../models/UserModel";
import UserActivator, { IUserActivator } from "../models/UserActivatorModel";

interface IRegisterUserReqBody {
  nickname: string;
  email: string;
  password: string;
}
interface IRegisterUserResBody {
  status: string;
  validationErrors?: IValidationError[];
  serverError?: { msg: string };
  data?: { savedUser: IUser; savedUserActivator: IUserActivator };
}
export const registerUser: RequestHandler<
  undefined,
  IRegisterUserResBody,
  IRegisterUserReqBody
> = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const myValidationResult = validationResult.withDefaults({
      formatter: (error) => {
        return {
          msg: error.msg,
          param: error.param
        };
      }
    });
    const newErrors = myValidationResult(req);
    return res.status(422).json({ status: "error", validationErrors: newErrors.array() });
  }

  const { nickname, email, password } = req.body;

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", serverError: { msg: "oops. some problems", ...error } });
  }

  const newUser = new User({ nickname, email, password: hashedPassword });
  let savedUser: IUser;
  try {
    savedUser = await newUser.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { msg: "oops. user creating problem" },
      ...error
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
      serverError: { msg: "oops. user activator creating problem" },
      ...error
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
      serverError: { msg: "oops. emailTemplate creating problem" },
      ...error
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
    return res
      .status(503)
      .json({ status: "error", serverError: { msg: "oops. email sending problem" }, ...error });
  }

  return res.status(201).json({ status: "success", data: { savedUser, savedUserActivator } });
};

interface IActivateUserParams {
  userId: string;
  hash: string;
}
interface IActivateUserResBody {
  status: string;
  serverError?: { msg: string };
}
export const activateUser: RequestHandler<IActivateUserParams, IActivateUserResBody> = async (
  req,
  res
) => {
  const userId = req.params.userId;
  const hash = req.params.hash;

  let activation: IUserActivator | null;
  try {
    activation = await UserActivator.findOne({ userId, hash });
  } catch (error) {
    return res.status(404).json({ status: "error", serverError: { msg: "invalid link" } });
  }
  if (!activation) {
    return res.status(404).json({ status: "error", serverError: { msg: "actiovation not found" } });
  }

  let user: IUser | null;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return res.status(404).json({ status: "error", serverError: { msg: "invalid link" } });
  }
  if (!user) {
    return res.status(404).json({ status: "error", serverError: { msg: "user not found" } });
  }

  user.isActive = true;
  try {
    await user.save();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { msg: "oops. user updating problem" },
      ...error
    });
  }

  try {
    await activation.remove();
  } catch (error) {
    return res.status(503).json({
      status: "error",
      serverError: { msg: "oops. userActivator removing problem" },
      ...error
    });
  }
  return (
    res
      .status(200)
      // .redirect("http://localhost:3000")
      .json({ status: "success" })
  );
};
