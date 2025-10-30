import { useState, useEffect } from "react";
import { db, storage } from "../util/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Button from "../Components/Button";
import Input from "../Components/Input";
import "./ProfilePage.css";
import BackButton from "../Components/BackButton";
import { useNavigate } from "react-router-dom";

function ProfilePage({ user }) {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: "",
    interests: "",
    photoURL: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);
      if (snap.exists()) setProfile(snap.data());
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = profile.photoURL;
      if (newImage) {
        const imageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(imageRef, newImage);
        imageUrl = await getDownloadURL(imageRef);
      }
      const refDoc = doc(db, "users", user.uid);
      await setDoc(
        refDoc,
        {
          name: profile.name,
          bio: profile.bio,
          skills: profile.skills,
          interests: profile.interests,
          photoURL: imageUrl,
        },
        { merge: true }
      );
      alert(" Profile updated successfully!");
      navigate("/dashboard");
    } 
    catch (err) 
    {
      console.error("Profile update error:", err);
      alert("Failed to update profile.");
    } 
    finally 
    {
      setLoading(false);
    }
  };


  return (
    <div className="profile-page">
      <BackButton />
      <h2>My Profile</h2>

      <div className="profile-photo-section">
        <img
          src={profile.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="profile-photo"
        />
        <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
      </div>

      <Input
        className="Input"
        placeholder="Full Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <textarea
        placeholder="Bio"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        className="Input"
        rows="3"
      />
      <Input
        className="Input"
        placeholder="Skills (comma separated)"
        value={profile.skills}
        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
      />
      <Input
        className="Input"
        placeholder="Interests (comma separated)"
        value={profile.interests}
        onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
      />
      <Button
        text={loading ? "Saving..." : "Save Changes"}
        onClick={handleSave}
      />
    </div>
  );
}

export default ProfilePage;
