import nodemailer from "nodemailer";

const options = {
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_KEY
  }
};

const transporter = nodemailer.createTransport(options);

export default transporter;
