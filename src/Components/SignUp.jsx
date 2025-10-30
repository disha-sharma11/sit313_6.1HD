import './SignUp.css';
import { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const response = await fetch("http://localhost:3002/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }), // same as form submission
      });
      if (!response.ok) {
        throw new Error('Subscription failed');
      }
      const text = await response.text();
      setMessage(text);
    } catch (err) {
      console.error("Error subscribing:", err);
      setMessage("Failed to subscribe.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1 className="signup-title">SIGN UP FOR OUR DAILY INSIDER</h1>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="signup-input"
        />
        <button type="submit" className="signup-button">Subscribe</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUp;