import { useState } from "react";
import Input from "./Input";
import "./PostPage.css"; // for consistent styling

function AITagGenerator({ title, description, tags, setTags }) {
  const [loading, setLoading] = useState(false);

  const handleSuggestTags = async () => {
    if (!title && !description) {
      alert("Please enter a title or description first!");
      return;
    }

    const prompt = `Suggest 3 short, relevant technology or topic tags for this post based on its title and description:
    Title: ${title}
    Description: ${description}`;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3002/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        throw new Error('Failed to get tag suggestions');
      }
      const data = await res.json();

      const suggested = data.reply
        ?.replace(/\n/g, " ")
        .replace(/[^\w, ]/g, "")
        .split(/,| /)
        .filter((t) => t && t.length > 2)
        .slice(0, 3)
        .join(", ");

      setTags(suggested);
      alert(`✨ Suggested tags: ${suggested}`);
    } catch (err) {
      console.error("AI Tag Error:", err);
      alert("Failed to get tag suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Section">
      <p className="Text">Tags</p>
      <Input
        className="Input"
        name="tags"
        what="text"
        placeholder="Add up to 3 tags e.g. React, JS, CSS"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button
        type="button"
        className="Button"
        onClick={handleSuggestTags}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Suggest Tags"}
      </button>
    </div>
  );
}

export default AITagGenerator;
