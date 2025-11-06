import { otpType } from "@prisma/client";
import nodemailer from "nodemailer";
// import { otpType } from "../../prisma/app/generated/prisma/client";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendOtpByEmail(email: string, otp: number, type: otpType) {
  if (!email) throw new Error("Recipient email is required!");

  const isVerification = type === "emailVerification";

  const subject = isVerification
    ? "🔰 Email Verification Code"
    : "🔐 Password Reset OTP";

  const htmlTemplate = isVerification
    ? `
<div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
  <div style="max-width:520px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:25px; border-top:6px solid #e63946;">
    
    <!-- Header -->
    <h2 style="color:#e63946; text-align:center; margin-bottom:10px;">🩸 রক্তদান</h2>
    <p style="text-align:center; font-size:16px; color:#333; margin:0;">
      <strong>রক্ত খুঁজুন, জীবন বাঁচান</strong>
    </p>

    <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">

    <p style="font-size:14px; color:#444; line-height:1.5;">
      আপনি রেজিস্ট্রেশন করেছেন এবং ইমেইল ভেরিফিকেশন করতে চাইছেন।  
      নিচে আপনার OTP কোড দেওয়া হলো।  
      দয়া করে এটি ব্যবহার করে আপনার Email ভেরিফাই করুন।
    </p>

    <div style="background:#fdecea; padding:15px; margin:20px 0; border-radius:8px; text-align:center; font-size:22px; font-weight:bold; color:#e63946; letter-spacing:3px;">
      ${otp}
    </div>

    <p style="font-size:12px; color:#777; text-align:center; margin-top:20px;">
      যদি এই ইমেইলটি আপনার জন্য না হয়ে থাকে, দয়া করে একে উপেক্ষা করুন। <br>
      ❤️ মানবতার সেবায় রক্তদান একটি মহৎ কাজ।
    </p>
  </div>
</div>`
    : `
<div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
  <div style="max-width:520px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:25px; border-top:6px solid #e63946;">
    
    <h2 style="color:#e63946; text-align:center; margin-bottom:10px;">🔐 পাসওয়ার্ড রিসেট</h2>
    <p style="text-align:center; font-size:16px; color:#333; margin:0;">
      <strong>আপনার একাউন্ট সুরক্ষিত রাখতে নিচের OTP ব্যবহার করুন</strong>
    </p>

    <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">

    <p style="font-size:14px; color:#444; line-height:1.5;">
      আপনি পাসওয়ার্ড রিসেট করার অনুরোধ করেছেন।  
      নিচে আপনার OTP কোড দেওয়া হলো।  
      দয়া করে এটি ব্যবহার করে আপনার পাসওয়ার্ড পুনরায় সেট করুন।  
    </p>

    <div style="background:#fdecea; padding:15px; margin:20px 0; border-radius:8px; text-align:center; font-size:22px; font-weight:bold; color:#e63946; letter-spacing:3px;">
      ${otp}
    </div>

    <p style="font-size:12px; color:#777; text-align:center; margin-top:20px;">
      যদি আপনি পাসওয়ার্ড রিসেটের অনুরোধ না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন।<br>
      🩸 <strong>রক্তদান</strong> — মানবতার সেবায় এক মহৎ উদ্যোগ।
    </p>
  </div>
</div>`;

  try {
    await transporter.sendMail({
      from: `"Rokto Dan Official" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html: htmlTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    return { success: false, message: "Failed to send OTP email." };
  }
}

export default sendOtpByEmail;
