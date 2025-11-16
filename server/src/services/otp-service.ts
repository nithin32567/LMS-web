import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

console.log(process.env.GMAIL_USER, process.env.GMAIL_APP_PASS,);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
});


export async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
    console.log(process.env.GMAIL_USER, process.env.GMAIL_APP_PASS);
    console.log("Sending OTP to email", email, otp);
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Welcome to our platform",
        text: `Welcome to our platform. Your OTP is ${otp}. This OTP will expire in 5 minutes.`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent to email", email);
        return true;
    } catch (error: any) {
        console.log("Error sending OTP to email", error?.message);
        return false;
    }
}

