import transporter from "../config/nodemailer.js";
import { emailTemplates } from "../templates/email.templates.js";

export const sendEmail = async ({ to, subject, type, data }) => {
  try {
    
    if (!emailTemplates[type]) {
      throw new Error(`Invalid email type: ${type}`);
    }

    const html = emailTemplates[type](data);

    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", result.messageId);
    return result;

  } catch (error) {
    console.error("Email failed:", error.message);
    throw error;
  }
};