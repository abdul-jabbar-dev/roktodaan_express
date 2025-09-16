import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";

const SendOTP = async (number: string) => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    const confirmation = await signInWithPhoneNumber(
      auth,
      number,
      recaptchaVerifier
    );
    return confirmation; // এইটা দিয়ে পরে verify করা যাবে
  } catch (err) {
    console.error("OTP send error:", err as any);
  }
};
export default SendOTP;
