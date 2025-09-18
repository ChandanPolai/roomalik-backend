import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.EMAIL_ENABLED === "true") {
    transporter = nodemailer.createTransport({
        secure: process.env.SMTP_SECURE === "true",
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false, // Allow self-signed certs
        },
    });

    transporter.verify((error, success) => {
        if (error) {
            console.error("SMTP Connection Error:", error);
        } else {
            console.log("SMTP is ready to send emails");
        }
    });
}



const sendVerificationMail = async (email, verificationCode) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Email Verification Code",
            text: `Hello, Your verification code is: ${verificationCode}`,
        });
        
    } catch (err) {
        console.error("Error sending email:", err)
    }
};

export const sendRoleChangeEmail = async (email, newRole, chapterName) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Your Account Role Updated",
            text: `Hello,
  
  Your role has been updated to: ${newRole}
  Chapter: ${chapterName}
  Your temporary password: 123456 (Please change it after login)
  
  Login now and reset if needed!`,
        });
        console.log("Role change email sent to:", email);
    } catch (err) {
        console.error("Error sending role email:", err);
    }
  };

export default sendVerificationMail