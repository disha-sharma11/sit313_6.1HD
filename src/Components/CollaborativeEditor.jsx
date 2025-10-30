import { arrayUnion, arrayRemove, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../util/firebase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../util/firebase"; // to get current user

function CollaborativeEditor({ questionId }) {
  const [content, setContent] = useState("");
  const [activeEditors, setActiveEditors] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!questionId) return;

    const ref = doc(db, "posts", questionId);

    // Listen to real-time updates
    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent(data.description || "");
        setActiveEditors(data.activeEditors || []);
      }
    });

    // Add current user to active editors
    if (currentUser?.email) {
      updateDoc(ref, {
        activeEditors: arrayUnion(currentUser.email),
      });
    }

    // Remove user on exit
    window.onbeforeunload = () => {
      if (currentUser?.email) {
        updateDoc(ref, {
          activeEditors: arrayRemove(currentUser.email),
        });
      }
    };

    return () => unsubscribe();
  }, [questionId, currentUser]);

  return (
    <motion.div
      className="editor-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="Input"
        placeholder="Edit collaboratively..."
      />
      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        Currently editing:{" "}
        {activeEditors.length > 0
          ? activeEditors.join(", ")
          : "Just you!"}
      </p>
    </motion.div>
  );
}

export default CollaborativeEditor;
