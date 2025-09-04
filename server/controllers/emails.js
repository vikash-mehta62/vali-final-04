const mailSender = require("../utils/mailSender");


exports.priceListSend = async (req, res) => {
  try {
      console.log(req.body);
      
      const { data, subject, message, cc, bcc } = req.body;
      const file = req.files?.attachments;

      const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background: #ffffff;">
        <h2 style="color: #333; text-align: center;">📜 Your Price List is Ready!</h2>
        <p style="color: #555; text-align: center; font-size: 16px;">Hello, we have attached the latest price list for you. You can download the PDF or check our online store.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://www.valiproduce.shop/store/template?storeId=1234&templateId=${message}" 
             style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; font-size: 16px; border-radius: 5px; text-decoration: none;">
            View Online
          </a>
        </div>

       

       

        <p style="color: #666; font-size: 14px; text-align: center;">If you have any questions, feel free to contact us.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="color: #888; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
      </div>
    `;

      const response = await mailSender(data, subject, html, file, cc, bcc);

      console.log(response);
      return res.status(200).json({
          success: true,
          message: "Message Sent Successfully!"
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success: false,
          message: "Error in sending email"
      });
  }
}


exports.priceListSendMulti = async (req, res) => {
  try {
    const { url, selectedStore } = req.body;

    if (!url || !selectedStore || !Array.isArray(selectedStore)) {
      return res.status(400).json({
        success: false,
        message: "Missing url or selected stores",
      });
    }

    // HTML content for the email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background: #ffffff;">
        <h2 style="color: #333; text-align: center;">📜 Your Price List is Ready!</h2>
        <p style="color: #555; text-align: center; font-size: 16px;">Hello, we have the latest price list for you. You can check our online store.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${url}"
             style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; font-size: 16px; border-radius: 5px; text-decoration: none;">
            View Online
          </a>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center;">If you have any questions, feel free to contact us.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #888; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
      </div>
    `;

    const subject = "📜 New Price List Available";

    // Optional: add file, cc, bcc if needed
    const file = null;
    const cc = null;
    const bcc = null;

    // Send email to each selected store
    for (const store of selectedStore) {
      const email = store.value;
      const data = { email };

      await mailSender(email, subject, html, file, cc, bcc);
    }

    return res.status(200).json({
      success: true,
      message: "Messages sent successfully!",
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending emails",
    });
  }
};
