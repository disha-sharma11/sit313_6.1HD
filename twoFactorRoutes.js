import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let activeOtps = {}; // store temporary OTPs in-memory

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps[email] = otp;

  const msg = {
    to: email,
    from: "itsdisha36@gmail.com",
    subject: "Your DEV@Deakin Verification Code",
    html: `<h2>Your verification code:</h2><h1>${otp}</h1><p>Valid for 5 minutes.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (activeOtps[email] === otp) {
    delete activeOtps[email];
    return res.json({ success: true });
  }
  res.status(400).json({ success: false, error: "Invalid OTP" });
});

export default router;
