const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST_NAME,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html, retries = 3) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);

    // Handle unregistered emails (for example, by checking the error code)
    if (error.responseCode === 550 || error.responseCode === 551) {
      // 550 and 551 are common SMTP error codes for unregistered addresses
      console.warn(`Email to ${to} is unregistered.`);
      return; // Don't retry for unregistered emails
    }

    // Retry logic for other errors
    if (retries > 0 && !isClientError(error)) {
      console.log(`Retrying... Attempts left: ${retries}`);
      return sendEmail(to, subject, text, html, retries - 1);
    } else {
      throw error; // Rethrow for critical errors
    }
  }
};

const isClientError = (error) => {
  return error.responseCode >= 400 && error.responseCode < 500;
};

module.exports = sendEmail;
