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
      user: "muhamed.begic01@gmail.com",
      pass: "nnsf mkuu beuv uyji",
    },
  });

  const mailOptions = {
    from: "Shopium <noreply.muhamed.begic01@gmail.com>",
    to: email,
    subject: "Password recovery",
    html: html,
    replyTo: "noreply.muhamed.begic01@gmail.com",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log(`Email sent to: ${email}`, info.response);
    }
  });
};
