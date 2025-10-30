import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import Button from "../Components/Button";
import "./auth-container.css";
import { signupWithEmailAndPassword, createUserDoc } from "../util/firebase";
import bcrypt from "bcryptjs";
import BackButton from "../Components/BackButton";

function Signup() {
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  }

  async function userSignup() {
    const { firstName, lastName, email, password, confirmPassword } = contact;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

      const { user } = await signupWithEmailAndPassword(email, password);
      await createUserDoc(user, { firstName, lastName, hashedPassword });

      navigate("/login");
      alert("Signup successful! Please log in.");
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("This email is already registered.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters.");
          break;
        default:
          alert("Signup failed. Please try again.");
      }
    }
  }

  return (
    <div className="auth-container">
      <BackButton />
      <Input
        name="firstName"
        placeholder="First Name"
        value={contact.firstName}
        onChange={handleChange}
      />
      <Input
        name="lastName"
        placeholder="Last Name"
        value={contact.lastName}
        onChange={handleChange}
      />
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
        type="password"
        value={contact.password}
        onChange={handleChange}
      />
      <Input
        name="confirmPassword"
        what="Password"
        placeholder="Confirm Password"
        type="password"
        value={contact.confirmPassword}
        onChange={handleChange}
      />
      <Button onClick={userSignup} text="Sign Up" />
      <br />
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button text="Already have an account? Login" />
      </Link>
    </div>
  );
}

export default Signup;