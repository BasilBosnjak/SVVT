import nodemailer from "nodemailer";

// email: muhamed.begic01@gmail.com
// password: nnsf mkuu beuv uyji

export const sendVerificationEmail = (token, email, name, id) => {
  const html = `
        <html>
            <body>
            <h2>Dear ${name}</h2>
            <p>Thank you for signing up at Shopium E-commerce!</p>
            <p>Use the link below to verify your email address.</p>
            <a href="http://localhost:3000/email-verify/${token}">Click here.</a>
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
    subject: "Account verification",
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
