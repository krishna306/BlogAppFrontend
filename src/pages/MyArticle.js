import React, { useState } from "react";
import { useGetAllUserPostQuery } from "../services/appApi";
import { Spinner, Container, Pagination } from "react-bootstrap";
import ArticlePreview from "../Components/ArticlePreview";

const PAGE_SIZE = 9;

function MyArticle() {
  const [page, setPage] = useState(1);
  const { data, isError, isLoading, isFetching } = useGetAllUserPostQuery({
    page,
    limit: PAGE_SIZE,
  });
  const userArticles = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isError) {
    return (
      <div className="empty-state">
        <h1>Could not load your stories</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="loading-state">
        <Spinner animation="border" role="status" />
        <h2 className="py-2">Loading stories…</h2>
      </div>
    );
  }
  if (userArticles.length === 0) {
    return (
      <div className="empty-state">
        <h1>You don’t have articles yet</h1>
        <p>Write your first post from New Article.</p>
      </div>
    );
  }
  return (
    <Container className="page-shell">
      <h1 className="banner__title text-center mb-4">My Articles</h1>
      <div className="card-grid">
        {userArticles.map((article) => (
          <ArticlePreview
            article={article}
            currentUserPost={true}
            key={article._id}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pager">
          <Pagination>
            <Pagination.Prev
              disabled={page <= 1 || isFetching}
              onClick={() => setPage(page - 1)}
            />
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
              <Pagination.Item
                key={p}
                active={p === page}
                onClick={() => setPage(p)}
              >
                {p}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage(page + 1)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
}

export default MyArticle;
