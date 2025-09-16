import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // true for 465, false for other ports

  auth: {
    user: process.env.GMAIL_USER, // Gmail address
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // SSL verify skip করবে
  },
});

async function sendOtpByEmail(email: string, otp: number) {
  // Wrap in an async IIFE so we can use await.
  console.log(email);
  if (!email) throw new Error("Recipient email is required!");

  const htmlTemplate = `
<div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
  <div style="max-width:520px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:25px; border-top:6px solid #e63946;">
    
    <!-- Header -->
    <h2 style="color:#e63946; text-align:center; margin-bottom:10px;">🩸 রক্তদান</h2>
    <p style="text-align:center; font-size:16px; color:#333; margin:0;">
      <strong>রক্ত খুঁজুন, জীবন বাঁচান</strong>
    </p>

    <!-- Divider -->
    <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">

    <!-- Body -->
    <p style="font-size:14px; color:#444; line-height:1.5;">
      আপনি রেজিস্ট্রেশন করেছেন এবং ইমেইল ভেরিফিকেশন করতে চাইছেন।  
      নিচে আপনার OTP code দেওয়া হলো।  
      দয়া করে এটি ব্যবহার করে আপনার Email ভেরিফাই করুন।
    </p>

    <!-- OTP Box -->
    <div style="background:#fdecea; padding:15px; margin:20px 0; border-radius:8px; text-align:center; font-size:22px; font-weight:bold; color:#e63946; letter-spacing:3px;">
      ${otp}
    </div>

    <!-- Footer -->
    <p style="font-size:12px; color:#777; text-align:center; margin-top:20px;">
      যদি এই ইমেইলটি আপনার জন্য না হয়ে থাকে, দয়া করে একে উপেক্ষা করুন। <br>
      ❤️ মানবতার সেবায় রক্তদান একটি মহৎ কাজ।
    </p>
  </div>
</div>
`;
  try {
    const info = await transporter.sendMail({
      from: `"Rokto Dan Official" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code ✔", // plain‑text body
      html: htmlTemplate, // HTML body
    });
    return ({...info,otp});
  } catch (error) {
    console.log("OTP email sent!", error);
  }
}
export default sendOtpByEmail;
