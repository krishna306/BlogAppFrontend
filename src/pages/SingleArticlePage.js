import React from "react";
import { useSelector } from "react-redux";
import { useGetAllPostQuery, useGetOnePostQuery } from "../services/appApi";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { categoryLabel } from "../constants/categories";
import {
  creatorEmail,
  creatorId,
  displayInitial,
  displayName,
  readingTimeMinutes,
} from "../utils/articleMeta";
import CoverImage from "../Components/CoverImage";

function SingleArticlePage() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { isLoading, data: article, isError } = useGetOnePostQuery(id);
  const category = article?.category || "all";
  const { data: relatedData } = useGetAllPostQuery(
    { page: 1, limit: 6, category },
    { skip: !article }
  );

  if (isError) {
    return (
      <div className="empty-state">
        <h1>Story not found</h1>
      </div>
    );
  }
  if (isLoading || !article) {
    return (
      <div className="loading-state">
        <Spinner animation="border" role="status" />
        <h2 className="py-2">Loading story…</h2>
      </div>
    );
  }

  const email = creatorEmail(article.creator);
  const author = displayName(email);
  const minutes = readingTimeMinutes(article.content);
  const isOwner = Boolean(
    user?._id && String(creatorId(article.creator)) === String(user._id)
  );
  const moreStories = (relatedData?.posts || [])
    .filter((post) => post._id !== article._id)
    .slice(0, 3);
  const nextStory = moreStories[0];
  const categoryHref =
    article.category && article.category !== "other"
      ? `/?category=${encodeURIComponent(article.category)}`
      : "/";

  return (
    <article className="article-page">
      <Link to="/" className="article-back">
        ← All stories
      </Link>

      {article.image && (
        <CoverImage className="cover" src={article.image} alt="" />
      )}

      <div className="article-meta-row">
        <Link to={categoryHref} className="article-category">
          {categoryLabel(article.category)}
        </Link>
        {article.created_at && (
          <span>{article.created_at}</span>
        )}
        <span>{minutes} min read</span>
      </div>

      <h1 className="article-title">{article.title}</h1>

      <div className="article-byline">
        <span className="account-avatar" aria-hidden="true">
          {displayInitial(email)}
        </span>
        <div>
          <strong>{author}</strong>
          {email && <span className="article-byline-email">{email}</span>}
        </div>
      </div>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="article-footer">
        {isOwner && (
          <Link
            className="action-btn action-btn--ghost"
            to={`/articles/${article._id}/edit`}
          >
            Edit story
          </Link>
        )}
        {nextStory ? (
          <Link
            className="action-btn action-btn--primary"
            to={`/articles/${nextStory._id}`}
          >
            Next story →
          </Link>
        ) : (
          <Link className="action-btn action-btn--primary" to="/">
            More stories →
          </Link>
        )}
      </div>

      {moreStories.length > 0 && (
        <section className="article-more">
          <h2>Keep reading</h2>
          <ul>
            {moreStories.map((post) => (
              <li key={post._id}>
                <Link to={`/articles/${post._id}`}>{post.title}</Link>
                <span>{categoryLabel(post.category)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export default SingleArticlePage;
