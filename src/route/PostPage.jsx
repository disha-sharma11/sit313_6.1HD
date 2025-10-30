import "../Components/PostPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionForm from "../Components/QuestionForm";
import ArticleForm from "../Components/ArticleForm";
import { db, storage, auth } from "../util/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Button from "../Components/Button";
import AITagGenerator from "../Components/AITagGenerator";
import BackButton from "../Components/BackButton";

import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { yCollab } from "y-codemirror.next";
import { EditorView } from "@codemirror/view";
import { useRef } from "react";

// import CodeMirror from "@uiw/react-codemirror";
import React, { Suspense, lazy } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactMarkdown from "react-markdown";

import { useParams } from "react-router-dom";
import { getDoc, updateDoc } from "firebase/firestore";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

function PostPage() {
  const [postType, setPostType] = useState("question");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [abstract, setAbstract] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [cursorColors, setCursorColors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const postRef = doc(db, "posts", id);
      const unsubscribe = onSnapshot(postRef, (snap) => {
        if (snap.exists()) {
          const post = snap.data();
          setTitle(post.title);
          setDescription(post.description);
          setCode(post.code);
          setTags(post.tag);
          setPostType(post.type);
        }
      });
      return unsubscribe;
    }
  }, [id]);

  const editorRef = useRef(null);

  useEffect(() => {
    if (!id) return; // only apply to edit mode

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(`post-${id}`, ydoc, {
      signaling: ["https://signaling-server-ny2i.onrender.com"],
    });

    const yText = ydoc.getText("codemirror");

    // 🧠 Add Step 3: Set presence for each user
    provider.awareness.setLocalStateField("user", {
      name: auth?.currentUser?.displayName || "Anonymous",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    // 👇 Debug: See connected peers
    provider.on("status", (event) => {
      console.log("WebRTC status:", event.status); // "connected" or "disconnected"
    });

    // Initialize collaborative editor
    if (!editorRef.current) {
      const view = new EditorView({
        parent: document.querySelector("#editor"),
        extensions: [javascript(), oneDark, yCollab(yText, provider.awareness)],
      });
      editorRef.current = view;
    }

    return () => {
      provider.destroy();
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [id]);

  const handlePost = async () => {
    try {
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `posts/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
      if (id) {
        await updateDoc(doc(db, "posts", id), {
          title,
          description,
          code,
          tag: tags,
          updatedAt: new Date(),
        });
        alert("✅ Post updated!");
        navigate("/");
      } else {
        await addDoc(collection(db, "posts"), {
          title,
          abstract,
          description,
          tag: tags,
          imageUrl,
          code,
          type: postType,
          createdAt: new Date(),
          views: 0,
          likes: 0,
        });

        alert("✅ Post added!");
        setTitle("");
        setDescription("");
        setTags("");
        setAbstract("");
        setImage(null);
        setPostType("");
        setCode("");
        navigate("/");
      }
    } catch (error) {
      console.error("Error posting:", error);
      alert("Error while posting!");
    }
  };

  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  async function handleAskAI() {
    try {
      const res = await fetch("http://localhost:3002/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        throw new Error("AI request failed");
      }
      const data = await res.json();
      setAiResponse(data.reply);
    } catch (error) {
      console.error("AI request failed:", error);
      alert("Failed to get AI response.");
    }
  }

  // 🟣 Firebase Cursor Tracking
  useEffect(() => {
    if (!id || !auth?.currentUser) return;

    const userId = auth.currentUser.uid;
    const cursorRef = doc(db, "posts", id, "cursors", userId);
    const cursorsCollection = collection(db, "posts", id, "cursors");

    const myColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const myName = auth.currentUser.displayName || "Anonymous";

    // Update Firebase with user's cursor position
    const handleMouseMove = (e) => {
      setDoc(cursorRef, {
        x: e.clientX,
        y: e.clientY,
        color: myColor,
        name: myName,
        lastUpdated: Date.now(),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Listen for all active cursors
    const unsub = onSnapshot(cursorsCollection, (snapshot) => {
      const cursorData = {};
      snapshot.forEach((doc) => {
        if (doc.id !== userId) cursorData[doc.id] = doc.data();
      });
      setCursorColors(cursorData);
    });

    // Clean up on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      deleteDoc(cursorRef); // remove your cursor when you leave
      unsub();
    };
  }, [id, auth?.currentUser]);

  return (
    <div className="template">
      {/* 🟢 Live Cursors */}
      {Object.entries(cursorColors).map(([uid, cursor]) => (
        <div
          key={uid}
          style={{
            position: "absolute",
            left: cursor.x,
            top: cursor.y,
            backgroundColor: cursor.color,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            boxShadow: `0 0 8px ${cursor.color}`,
            zIndex: 9999,
          }}
          title={cursor.name}
        />
      ))}

      <BackButton />
      <nav className="Bar">New Post</nav>

      <p>Select Post Type:</p>
      <label>
        <input
          type="radio"
          name="postType"
          value="question"
          checked={postType === "question"}
          onChange={(e) => setPostType(e.target.value)}
        />
        Question
      </label>
      <label>
        <input
          type="radio"
          name="postType"
          value="article"
          checked={postType === "article"}
          onChange={(e) => setPostType(e.target.value)}
        />
        Article
      </label>

      <p className="Bar">What do you want to ask or share?</p>

      {postType === "question" && (
        <QuestionForm
          setTitle={setTitle}
          setImage={setImage}
          setDescription={setDescription}
          setCode={setCode}
          title={title}
          image={image}
          description={description}
          code={code}
        />
      )}

      {postType === "article" && (
        <ArticleForm
          setAbstract={setAbstract}
          setDescription={setDescription}
          setTitle={setTitle}
          setImage={setImage}
          title={title}
          image={image}
          abstract={abstract}
          description={description}
          code={code}
        />
      )}

      <div>
        <p className="Text">Or use the code editor below:</p>
        <br />
        <div id="editor" className="collab-editor"></div>

        <br />
        <p className="Text">Preview:</p>
        <div className="markdown-preview">
          <ReactMarkdown>{code}</ReactMarkdown>
        </div>
      </div>

      <AITagGenerator
        title={title}
        description={description}
        tags={tags}
        setTags={setTags}
      />
      {/* 🔹 AI Assistant Section */}
      <div className="ai-helper">
        <p className="Text">Need help? Ask AI 🤖</p>
        <textarea
          placeholder="Ask AI to suggest tags, improve your title, or summarize your post..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="Input"
          rows="3"
        />
        <Button text="Ask AI" type="button" onClick={handleAskAI} />
        {aiResponse && (
          <div className="ai-response">
            <strong>AI Suggestion:</strong>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
      <Button text="Post" type="button" onClick={handlePost} />
    </div>
  );
}

export default PostPage;
