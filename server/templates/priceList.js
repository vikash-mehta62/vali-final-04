const sendEmail = async (email, subject, message, file, cc, bcc) => {
    let mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      cc: cc || "", // Optional
      bcc: bcc || "", // Optional
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">📜 Your Template is Ready</h2>
          <p style="color: #555; text-align: center;">Hello, we have prepared a template for you. Click the button below to view it.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://9rx.com/store/template?templateId=${message}" 
               style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; font-size: 16px; border-radius: 5px; text-decoration: none;">
              View Template
            </a>
          </div>
  
          <p style="color: #666; font-size: 14px; text-align: center;">If you have any questions, feel free to contact us.</p>
  
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  
          <p style="color: #888; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
        </div>
      `,
      attachments: [
        {
          filename: file.name,
          content: file.data,
          contentType: file.mimetype,
        },
      ],
    };
  
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };
  };
  