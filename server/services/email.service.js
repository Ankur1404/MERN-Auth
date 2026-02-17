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

// import resend from "../config/resend.js";
// import { emailTemplates } from "../templates/email.templates.js";

// export const sendEmail = async ({ to, subject, type, data }) => {
//   try {
//     console.log("📨 Preparing email...");
//     console.log("➡️ To:", to);
//     console.log("➡️ Type:", type);

//     if (!emailTemplates[type]) {
//       throw new Error(`Invalid email type: ${type}`);
//     }

//     const html = emailTemplates[type](data);

//     console.log("📄 Generated HTML length:", html.length);

//     const response = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent successfully:", response);

//     return response;

//   } catch (error) {
//     console.error("❌ Full Email Error Object:", error);
//     console.error("❌ Error Message:", error.message);
//     console.error("❌ Error Stack:", error.stack);

//     throw error;
//   }
// };
