import transporter from "../config/nodemailer.js";
import { emailTemplates } from "../templates/email.templates.js";

export const sendEmail = async ({ to, subject, type, data }) => {
  try {
    
    if (!emailTemplates[type]) {
      throw new Error(`Invalid email type: ${type}`);
    }

    const html = emailTemplates[type](data);

    await transporter.sendMail({
      to,
      subject,
      html,
    });

  } catch (error) {
    console.error("Email failed:", error.message);
  }
};