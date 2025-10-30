
function QuestionForm({
  setTitle,
  setImage,
  setDescription,
  title,
  image,
  description,
}) {
  return (
    <>
      <div className="Section">
        <p className="Text">Title</p>
        <input
          className="Input"
          type="text"
          placeholder="Start your question with how, what, why, etc."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="Section">
        <p className="Text">Image</p>
        <input
          className="Input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image && <p>Selected: {image.name}</p>}
      </div>

      <div className="Section">
        <p className="Text">Describe your problem</p>
        <textarea
          className="Input"
          rows="5"
          placeholder="Explain your problem here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </>
  );
}

export default QuestionForm;
