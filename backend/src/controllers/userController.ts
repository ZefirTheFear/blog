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

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ nickname, email, password: hashedPassword });
    let savedUser;
    try {
      savedUser = await newUser.save();
    } catch (error) {
      return res.status(503).json({
        status: "error",
        serverError: { msg: "oops. user creating problems" },
        ...error
      });
    }

    const hash = uuid();
    const newUserActivator = new UserActivator({
      userId: savedUser._id,
      hash: hash
    });
    let savedUserActivator;
    try {
      savedUserActivator = await newUserActivator.save();
    } catch (error) {
      await savedUser.remove();
      return res.status(503).json({
        status: "error",
        serverError: { msg: "oops. user activator creating problems" },
        ...error
      });
    }

    let emailTemplate;
    try {
      emailTemplate = await ejs.renderFile(path.join(__dirname, "../views/register.ejs"), {
        nickname,
        domain: process.env.DOMAIN,
        userId: savedUser._id,
        hash
      });
    } catch (error) {
      await savedUser.remove();
      await savedUserActivator.remove();
      return res.status(503).json({
        status: "error",
        serverError: { msg: "oops. emailTemplate creating problems" },
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
        .json({ status: "error", serverError: { msg: "oops. email sending problems" }, ...error });
    }

    return res.status(201).json({ status: "success", data: { savedUser, savedUserActivator } });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", serverError: { msg: "oops. some problems", ...error } });
  }
};
