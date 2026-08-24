import nodemailer from "nodemailer";

export const sendVerificationEmail = (token, email, name, id) => {
  const html = `
        <html>
            <body>
            <h2>Dear ${name}</h2>
            <p>Thank you for signing up at Shopium E-commerce!</p>
            <p>Use the link below to verify your email address.</p>
            <a href="${process.env.BASE_URL}/email-verify/${token}">Click here.</a>
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
    subject: "Account verification",
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
