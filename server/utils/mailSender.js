const nodemailer = require("nodemailer");
const fs = require("fs");

const mailSender = async (email, subject, message, file, cc, bcc) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    // Build base mail options
    let mailOptions = {
      from: "order@valiproduce.shop",
      to: email,
      cc: cc || "", // Optional
      bcc: bcc || "", // Optional
      subject: subject,
      html: message,
    };

    // If file is present, add it as an attachment
    if (file && file.tempFilePath) {
      const fileBuffer = fs.readFileSync(file.tempFilePath);
      mailOptions.attachments = [
        {
          filename: file.name,
          content: fileBuffer,
          contentType: file.mimetype || "application/octet-stream",
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
    
  } catch (error) {
    console.log("Error sending email:", error.message);
    return error.message;
  }
};

module.exports = mailSender;
