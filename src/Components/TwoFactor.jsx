import { useState } from "react";

function TwoFactor({ userEmail, onVerified }) {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");

  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!res.ok) {
        throw new Error('Failed to send OTP');
      }
      setStep("verify");
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp }),
      });
      if (!res.ok) {
        throw new Error('Verification failed');
      }
      const data = await res.json();
      if (data.success) {
        alert("Verification successful!");
        onVerified();
      } else {
        alert("Incorrect OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="template">
      <h2>Two-Factor Verification</h2>
      {step === "send" ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <div>
          <input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify</button>
        </div>
      )}
    </div>
  );
}

export default TwoFactor;
