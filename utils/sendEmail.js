import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or "smtp.ethereal.email" for testing
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `"Job Board" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
