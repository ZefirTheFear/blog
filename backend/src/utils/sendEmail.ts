import transporter from "../core/mailer";

export const sendEmail = async (
  emailTo: string,
  emailFrom: string,
  subject: string,
  html: string
): Promise<unknown> => {
  try {
    const sendEmailResult = await transporter.sendMail({
      to: emailTo,
      from: emailFrom,
      subject: subject,
      html: html
    });
    return sendEmailResult;
  } catch (error) {
    console.log(error);
  }
};
