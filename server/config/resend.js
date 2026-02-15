import { Resend } from "resend";

console.log("🔑 RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
console.log("🔑 RESEND_API_KEY value:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
