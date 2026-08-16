import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDeletePostMutation } from "../services/appApi";
import { categoryLabel } from "../constants/categories";
import CoverImage from "./CoverImage";

function IconPencil() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
    </svg>
  );
}

function ArticlePreview({ article, currentUserPost }) {
  const { title, content, image, _id, category, created_at } = article;
  const [deleteArticle, { isLoading }] = useDeletePostMutation();

  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this story? This cannot be undone.")) {
      deleteArticle(_id);
    }
  }

  return (
    <Card className="article-card">
      <Link to={`/articles/${_id}`} className="article-card-media">
        <CoverImage className="card-img-top" src={image} alt="" />
      </Link>
      <Card.Body className="article-card-body">
        <p className="meta mb-2">
          {categoryLabel(category)} {created_at ? `· ${created_at}` : ""}
        </p>
        <Card.Title>
          <Link to={`/articles/${_id}`}>{title}</Link>
        </Card.Title>
        <Card.Text
          as="div"
          dangerouslySetInnerHTML={{
            __html: (content?.substring(0, 100) || "") + "...",
          }}
        />
        <div className="card-actions">
          <Link className="action-btn action-btn--primary" to={`/articles/${_id}`}>
            Read story
            <span aria-hidden="true">→</span>
          </Link>
          {currentUserPost && (
            <div className="card-actions-owner">
              <Link
                className="action-btn action-btn--ghost"
                to={`/articles/${_id}/edit`}
              >
                <IconPencil />
                Edit
              </Link>
              <button
                type="button"
                className="action-btn action-btn--icon"
                onClick={handleDelete}
                disabled={isLoading}
                aria-label="Delete story"
                title="Delete"
              >
                <IconTrash />
              </button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ArticlePreview;
