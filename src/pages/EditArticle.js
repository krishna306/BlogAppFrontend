import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import {
  useGetOnePostQuery,
  useUpdatePostMutation,
} from "../services/appApi";
import "./NewArticle.css";
import { useNavigate, useParams } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import { CATEGORIES } from "../constants/categories";
import CoverImage from "../Components/CoverImage";

const editorToolbar = {
  inline: { inDropdown: true },
  list: { inDropdown: true },
  textAlign: { inDropdown: true },
  link: { inDropdown: true },
  history: { inDropdown: true },
};

function htmlToEditorState(html) {
  const blocksFromHtml = convertFromHTML(html || "<p></p>");
  const contentState = ContentState.createFromBlockArray(
    blocksFromHtml.contentBlocks || [],
    blocksFromHtml.entityMap
  );
  return EditorState.createWithContent(contentState);
}

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: article,
    isLoading: isLoadingPost,
    isError,
  } = useGetOnePostQuery(id);
  const [updateArticle, { isLoading: isSaving, isSuccess }] =
    useUpdatePostMutation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (!article) return;
    setTitle(article.title || "");
    setCategory(article.category || "");
    setUrl(article.image || "");
    setEditorState(htmlToEditorState(article.content));
  }, [article]);

  function handleUpdate(e) {
    e.preventDefault();
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const hasText = editorState.getCurrentContent().hasText();
    if (!title.trim() || !hasText || !category) {
      setError("Title, story, and category are required.");
      return;
    }
    setError("");
    updateArticle({ id, title: title.trim(), content, category });
  }

  if (isLoadingPost) {
    return (
      <div className="loading-state">
        <Spinner animation="border" variant="dark" role="status" />
        <h2 className="py-2">Loading story…</h2>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="empty-state">
        <h1>Story not found</h1>
        <p>This post could not be loaded for editing.</p>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="loading-state">
        <Spinner animation="border" variant="dark" role="status" />
        <h2 className="py-2">Saving…</h2>
      </div>
    );
  }

  if (isSuccess) {
    setTimeout(() => navigate("/"), 1500);
    return (
      <div className="empty-state">
        <h1>Story updated</h1>
        <p>Taking you back to Inkline.</p>
      </div>
    );
  }

  return (
    <Container className="page-shell">
      <div className="compose-stack">
        <h1 className="compose-title">Edit story</h1>
        <p className="compose-kicker">Update this Inkline post</p>
        <Form onSubmit={handleUpdate}>
          {error && <p className="compose-error">{error}</p>}

          <div className="compose-block">
            <div className="compose-label">Cover</div>
            <div className="compose-cover">
              {url ? (
                <CoverImage className="cover-frame" src={url} alt="Cover" />
              ) : (
                <div className="cover-placeholder">No cover image</div>
              )}
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
              toolbar={editorToolbar}
            />
          </div>

          <div className="compose-actions">
            <Button className="btn-accent" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default EditArticle;
