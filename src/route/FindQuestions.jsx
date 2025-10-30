import "./FindQuestions.css";
import { db } from "../util/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../Components/Card.css";
import Input from "../Components/Input";
import { updateDoc, increment } from "firebase/firestore";
import BackButton from "../Components/BackButton";
import CollaborativeEditor from "../Components/CollaborativeEditor";
import { useNavigate } from "react-router-dom";

function FindQuestions() {
  const [questions, setQuestions] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortDate, setSortDate] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();


  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));

      const filteredDocs = querySnapshot.docs.filter(
        (doc) => doc.data().type === "question"
      );

      const questionsList = filteredDocs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setQuestions(questionsList);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setQuestions(questions.filter((ques) => ques.id !== id));
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };
  const handleLike = async (id) => {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { likes: increment(1) });
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: (q.likes || 0) + 1 } : q))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const incrementViews = async (id) => {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { views: increment(1) });
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, views: (q.views || 0) + 1 } : q))
      );
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId !== id) {
      incrementViews(id);
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredQuestions = questions
    .filter((q) => {
      const matchTitle = q.title
        ?.toLowerCase()
        .includes(searchTitle.toLowerCase());
      const matchTag = filterTag
        ? Array.isArray(q.tag)
          ? q.tag.some((tag) =>
              tag.toLowerCase().includes(filterTag.toLowerCase())
            )
          : q.tag?.toLowerCase().includes(filterTag.toLowerCase())
        : true;
      return matchTitle && matchTag;
    })
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const dateA = new Date(a.createdAt.seconds * 1000);
      const dateB = new Date(b.createdAt.seconds * 1000);
      return sortDate === "asc" ? dateA - dateB : dateB - dateA;
    });

  useEffect(() => {
    fetchQuestions(); // Run once on page load
  }, []);

  return (
    <div className="find-questions">
      <BackButton />
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Find Questions
      </h2>

      {/* Filter Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Input
          name="searchTitle"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="Input"
        />

        <Input
          name="filterTag"
          placeholder="Filter by tag..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="Input"
        />

        <select
          value={sortDate}
          onChange={(e) => setSortDate(e.target.value)}
          style={{
            width: "90%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #007bff",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s ease",
          }}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {/* Question Cards */}
      {filteredQuestions.length === 0 ? (
        <p style={{ textAlign: "center" }}>No questions found.</p>
      ) : (
        <div className="card-container">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="card"
              onClick={() => toggleExpand(q.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Title Always Visible */}
              <h3 className="card-title">{q.title}</h3>

              {/* Expanded details */}
              {expandedId === q.id && (
                <>
                  {q.imageUrl && (
                    <img
                      src={q.imageUrl}
                      alt="Question"
                      className="card-image"
                    />
                  )}
                  <p className="card-description">{q.description}</p>
                  {q.tags && <p className="card-example">Tags: {q.tags}</p>}
                  {q.createdAt && (
                    <p className="card-rating">
                      Date:{" "}
                      {new Date(
                        q.createdAt.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {q.author && <p className="card-author">By {q.author}</p>}

                  <div className="card-stats">
                    <button
                      className="like-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(q.id);
                      }}
                    >
                      ❤️ {q.likes || 0}
                    </button>
                    <span className="views">👀 {q.views || 0}</span>
                  </div>
                      <button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/post/${q.id}`);
  }}
  className="edit-button"
>
  ✏️ Edit Question
</button>


    {editingId === q.id && (
      <CollaborativeEditor questionId={q.id} />
    )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // stop expand toggle
                      handleDelete(q.id);
                    }}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindQuestions;
