function ArticleForm({ setAbstract, setDescription, setTitle, setImage, title, image, abstract, description }) {
  return (
    <>
      <div className="Section">
        <p className="Text">Title</p>
        <input
          className="Input"
          type="text"
          placeholder="Enter a descriptive title"
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
        {image && <p>Selected file: {image.name}</p>}
      </div>

      <div className="Section">
        <p className="Text">Abstract</p>
        <input
          className="Input"
          type="text"
          placeholder="Enter a 1-paragraph abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
        />
      </div>

      <div className="Section">
        <p className="Text">Article Text</p>
        <textarea
          className="Input"
          rows="6"
          placeholder="Write your article here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </>
  );
}

export default ArticleForm;
