import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../util/firebase";
import { useTheme } from "../App";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully!");
  };
  return (
    <nav className="navbar">
      <p>DEV@Deakin</p>
      {/* <input type="text" className="search-input" placeholder="Search..." /> */}
      <Link to="/post" className="button">
        Post
      </Link>
      <Link to="/questions" className="button">
        Find Questions
      </Link>
      <Link to="/plans" className="button">
        Plans
      </Link>
      <button onClick={toggleTheme} className="toggle-btn">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {currentUser ? (
        <>
          <Link to="/dashboard" className="button">Dashboard</Link>
          <button onClick={handleLogout} className="button logout-btn">
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="button">
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
