import nodeMailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import mailgunTransport from 'nodemailer-mailgun-transport';

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};
const transporter = nodeMailer.createTransport(mailgunTransport(auth));

const sendEmailToUser = asyncHandler(async (info) => {
  await transporter.sendMail({
    from: info.from || `Gemini App <no-reply@sample.com>`, // sender address
    to: info.to, // list of receivers
    subject: info.subject, // Subject line
    text: info.text, // plain text body
    html: info.htm, // html body
  });
});

export { sendEmailToUser };
