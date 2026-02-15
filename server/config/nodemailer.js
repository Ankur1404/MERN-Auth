import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    service : "gmail" ,
    port: 587,
  secure: false, 
    auth:{
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

export default transporter;