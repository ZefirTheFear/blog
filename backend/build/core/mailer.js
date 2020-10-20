"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var options = {
    host: "smtp.sendgrid.net",
    port: 465,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_KEY
    }
};
var transporter = nodemailer_1.default.createTransport(options);
exports.default = transporter;
