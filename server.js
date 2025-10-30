import aiRoutes from "./aiRoutes.js";
import express from "express";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import dotenv from "dotenv";
import twoFactorRoutes from "./twoFactorRoutes.js";



dotenv.config();
console.log("Loaded keys:", Object.keys(process.env));

console.log("OpenAI key loaded:", !!process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3002;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json()); // Needed for AI route
app.use(express.urlencoded({ extended: false })); // Needed for form data

// AI routes
app.use("/api", aiRoutes);
app.use("/api", twoFactorRoutes);

// Subscribe route
app.post("/subscribe", async (req, res) => {
  const userEmail = req.body.email;

  const msg = {
    to: userEmail,
    from: "itsdisha36@gmail.com",
    subject: "Welcome to DEV@Deakin!",
    html: `...`, // your HTML email here
  };

  try {
    await sgMail.send(msg);
    res.send("Message sent successfully!");
  } catch (error) {
    console.error(error);
    if (error.response) console.error(error.response.body);
    res.status(500).send("Failed to send message.");
  }
});

// Start server AFTER routes
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
