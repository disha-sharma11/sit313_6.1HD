import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import Button from "../Components/Button";
import "./auth-container.css";
import { loginWithEmailAndPassword, signInWithGoogle, createUserDoc } from "../util/firebase";
import SignOut from "./SignOut";
import TwoFactor from "../Components/TwoFactor";
import BackButton from "../Components/BackButton";


function Login() {
  const navigate = useNavigate();
  const [contact, setContact] = useState({ email: "", password: "" });
  const [step, setStep] = useState("login");
  const [userEmail, setUserEmail] = useState("");


  function handleChange(e) {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  }

  async function loginUser() {
  try {
    const { email, password } = contact;
    await loginWithEmailAndPassword(email, password);
    setUserEmail(email); 
    setStep("verify"); 
    alert("Logged in successfully! Please verify with OTP.");
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    switch (error.code) {
      case "auth/user-not-found":
        alert("No account found with this email.");
        break;
      case "auth/wrong-password":
        alert("Incorrect password.");
        break;
      case "auth/invalid-email":
        alert("Invalid email format.");
        break;
      case "auth/missing-password":
        alert("Please enter your password.");
        break;
      default:
        alert("Login failed. Please try again.");
    }
  }
}


  async function googleLogin() {
    try {
      const { user } = await signInWithGoogle();
      await createUserDoc(user);
      navigate("/");
    } catch (error) {
      alert("Google sign-in failed.");
    }
  }

  return (
    <div>
    <BackButton />
  <div className="auth-container">
    {step === "login" ? (
      <>
        <Input
          name="email"
          placeholder="Email"
          value={contact.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          what="Password"
          placeholder="Password"
          value={contact.password}
          onChange={handleChange}
        />
        <Button onClick={loginUser} text="Login" />
        <br />
        <Button onClick={googleLogin} text="Sign in with Google" />
        <br />
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <Button text="Sign Up Instead" />
        </Link>
        <br />
        <SignOut />
      </>
    ) : (
      <TwoFactor
        userEmail={userEmail}
        onVerified={() => {
          alert("2FA Verified! Redirecting...");
          navigate("/"); // go home only after OTP verification
        }}
      />
    )}
  </div>
  </div>
);

}

export default Login;