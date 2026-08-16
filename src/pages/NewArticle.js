import React, { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { useCreatePostMutation } from "../services/appApi";
import { CATEGORIES } from "../constants/categories";
import "./NewArticle.css";
import { useNavigate } from "react-router-dom";
import CoverImage from "../Components/CoverImage";

const editorToolbar = {
  inline: { inDropdown: true },
  list: { inDropdown: true },
  textAlign: { inDropdown: true },
  link: { inDropdown: true },
  history: { inDropdown: true },
};

function NewArticle() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [createPost, { isLoading, isSuccess }] = useCreatePostMutation();
  const [uploadingImage, setUplaodingImage] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  function uploadFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Cover image must be 10MB or less.");
      return;
    }
    setError("");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "jmx0pqmy");
    setUplaodingImage(true);
    fetch("https://api.cloudinary.com/v1_1/df4105oag/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.secure_url && !data.url) {
          setError("Image upload failed. Try another file.");
          setUplaodingImage(false);
          return;
        }
        const uploaded = (data.secure_url || data.url).replace(
          /^http:\/\//i,
          "https://"
        );
        setUrl(uploaded);
        setUplaodingImage(false);
      })
      .catch(() => {
        setUplaodingImage(false);
        setError("Image upload failed. Try again.");
      });
  }

  function handlePublish(e) {
    e.preventDefault();
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const hasText = editorState.getCurrentContent().hasText();
    if (!title.trim() || !hasText || !category || !url) {
      setError("Title, story, category, and cover image are required.");
      return;
    }
    setError("");
    createPost({ title: title.trim(), image: url, content, category });
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <Spinner animation="border" variant="dark" role="status" />
        <h2 className="py-2">Publishing…</h2>
      </div>
    );
  }
  if (isSuccess) {
    setTimeout(() => navigate("/"), 1500);
    return (
      <div className="empty-state">
        <h1>Story published</h1>
        <p>Taking you back to Inkline.</p>
      </div>
    );
  }

  return (
    <Container className="page-shell">
      <div className="compose-stack">
        <h1 className="compose-title">Write a story</h1>
        <p className="compose-kicker">A new Inkline post</p>
        <Form onSubmit={handlePublish}>
          {error && <p className="compose-error">{error}</p>}

          <div className="compose-block">
            <div className="compose-label">Cover</div>
            <div className="compose-cover">
              {uploadingImage ? (
                <div className="cover-placeholder">
                  <div>
                    <Spinner animation="border" variant="dark" size="sm" />
                    <p className="compose-status mt-3">Uploading cover…</p>
                  </div>
                </div>
              ) : url ? (
                <CoverImage className="cover-frame" src={url} alt="Cover preview" />
              ) : (
                <div className="cover-placeholder">Add a cover image</div>
              )}
              <div className="compose-cover-bar">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadFile(e.target.files[0])}
                />
                <p className="compose-status">JPG or PNG, 10MB or less</p>
              </div>
            </div>
          </div>

          <div className="compose-block">
            <div className="compose-label">Title</div>
            <Form.Control
              className="compose-title-input"
              type="text"
              value={title}
              placeholder="Give it a title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="compose-block">
            <div className="compose-label">Category</div>
            <div className="category-bar" style={{ margin: 0 }}>
              {CATEGORIES.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={`category-chip${
                    category === item.value ? " is-active" : ""
                  }`}
                  onClick={() => setCategory(item.value)}
                >
                  {item.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="compose-block">
            <div className="compose-label">Story</div>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName="wrapper"
              editorClassName="editor"
              toolbarClassName="toolbar"
              placeholder="Start writing…"
              toolbar={editorToolbar}
            />
          </div>

          <div className="compose-actions">
            <Button className="btn-accent" type="submit" disabled={uploadingImage}>
              Publish
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default NewArticle;
