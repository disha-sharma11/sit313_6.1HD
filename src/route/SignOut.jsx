import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { auth, logout } from "../util/firebase";

function SignOut() {
  const navigate = useNavigate();

  async function handleSignOut() {
    if (!auth.currentUser) {
      alert("No user is currently logged in.");
      return;
    }
    try {
      await logout();
      alert("Signed out successfully!");
      navigate("/"); // redirect to home after sign out
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Sign out failed. Please try again.");
    }
  }

  return (
    <div>
      <Button onClick={handleSignOut} text="Sign Out" />
    </div>
  );
}

export default SignOut;
