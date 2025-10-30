import { useEffect, useState } from "react";
import { db } from "../util/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import BackButton from "../Components/BackButton";

function Dashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);
      if (snap.exists()) setProfile(snap.data());
    };
    fetchProfile();
  }, [user, navigate]);

  if (!profile) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="dashboard-container">
      <BackButton />
      <div className="dashboard-header">
        <h2>Welcome, {profile.name || user.displayName || "User"} 👋</h2>
        <button onClick={() => navigate("/profile")} className="edit-btn">
          Edit Profile
        </button>
      </div>

      <div className="dashboard-card">
        <img
          src={profile.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="dashboard-photo"
        />
        <div className="dashboard-details">
          <p><strong>Email:</strong> {user.email}</p>
          {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
          {profile.skills && <p><strong>Skills:</strong> {profile.skills}</p>}
          {profile.interests && <p><strong>Interests:</strong> {profile.interests}</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
