import React, { useState } from "react";
import { useGetAllUserPostQuery } from "../services/appApi";
import { Spinner, Container, Row, Col, Pagination } from "react-bootstrap";
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
      <div>
        <h1 className="text-center py-4">An error has occured</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" role="status" />
        <br />
        <h2 className="py-2">Loading...</h2>
      </div>
    );
  }
  if (userArticles.length === 0) {
    return (
      <div>
        <h1 className="text-center py-4">You don't have articles yet</h1>
      </div>
    );
  }
  return (
    <Container>
      <h1 className="text-center ">My Articles</h1>
      <Row>
        <Col md={9} className="d-flex justify-content-center flex-wrap gap-4">
          {userArticles.map((article) => (
            <ArticlePreview
              article={article}
              currentUserPost={true}
              key={article._id}
            />
          ))}
          {totalPages > 1 && (
            <div className="w-100 d-flex justify-content-center pt-3">
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
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
}

export default MyArticle;
