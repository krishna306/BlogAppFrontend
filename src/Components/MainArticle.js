import { Button } from "react-bootstrap";
import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { categoryLabel } from "../constants/categories";
import CoverImage from "./CoverImage";

function MainArticle({ article }) {
  if (!article) return null;
  const { title, image, content, _id, category, created_at } = article;
  return (
    <section className="hero">
      <CoverImage src={image} alt={title} />
      <div>
        <p className="meta">
          {categoryLabel(category)} {created_at ? `· ${created_at}` : ""}
        </p>
        <h2>{title}</h2>
        <div
          className="excerpt"
          dangerouslySetInnerHTML={{
            __html: (content?.substring(0, 280) || "") + "...",
          }}
        />
        <LinkContainer to={`/articles/${_id}`}>
          <Button className="btn-accent">Read story</Button>
        </LinkContainer>
      </div>
    </section>
  );
}

export default MainArticle;
