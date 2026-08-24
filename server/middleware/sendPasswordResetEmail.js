import nodemailer from "nodemailer";

export const sendPasswordResetEmail = (token, email, name) => {
  const html = `
        <html>
            <body>
            <h2>Dear ${name}</h2>
            <p>This is a password recovery email.</p>
            <p>Please use the link below to reset your password!</p>
            <a href="${process.env.BASE_URL}/password-reset/${token}">Click here.</a>
            </body>
        </html>
    `;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Shopium <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password recovery",
    html: html,
    replyTo: process.env.EMAIL_USER,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log(`Email sent to: ${email}`, info.response);
    }
  });
};
