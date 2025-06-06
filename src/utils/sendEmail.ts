import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (to: string, otp: string, from: string="Email Authentication"): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
    });

    const mailOptions = {
        from: `"${from}" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your OTP Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Your OTP Code</h2>
                <p>Your OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
                <p style="color: #666;">This code will expire in 5 minutes.</p>
                <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
        `,
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}
