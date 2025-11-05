"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("firebase/auth");
const firebase_1 = require("../lib/firebase");
const SendOTP = async (number) => {
    try {
        const recaptchaVerifier = new auth_1.RecaptchaVerifier(firebase_1.auth, "recaptcha-container", {});
        const confirmation = await (0, auth_1.signInWithPhoneNumber)(firebase_1.auth, number, recaptchaVerifier);
        return confirmation; // এইটা দিয়ে পরে verify করা যাবে
    }
    catch (err) {
        console.error("OTP send error:", err);
    }
};
exports.default = SendOTP;
