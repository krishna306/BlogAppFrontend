import React, { useState } from "react";
import MainArticle from "../Components/MainArticle";
import ArticlePreview from "../Components/ArticlePreview";
import { Container, Spinner, Row, Col, ListGroup, Pagination } from "react-bootstrap";
import { useGetAllPostQuery } from "../services/appApi";
import { LinkContainer } from "react-router-bootstrap";

const PAGE_SIZE = 9;

function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useGetAllPostQuery({
    page,
    limit: PAGE_SIZE,
  });
  const articles = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;
  const sidebarArticles = articles.slice(0, 4);
  const featuredArticle = page === 1 ? articles[0] : null;

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
  return (
    <Container>
      <div>
        <h1 className="banner__title">The MERN Tech Blog</h1>
      </div>
      <Row>
        {featuredArticle && <MainArticle article={featuredArticle} />}
        <Col md={9} className="blog-main d-flex pb-4 flex-wrap gap-4">
          {articles.map((article) => (
            <ArticlePreview article={article} currentUserPost={false} key={article._id} />
          ))}
          {totalPages > 1 && (
            <div className="w-100 d-flex justify-content-center pt-3">
              <Pagination>
                <Pagination.Prev
                  disabled={page <= 1 || isFetching}
                  onClick={() => handlePageChange(page - 1)}
                />
                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((items, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) {
                      items.push(<Pagination.Ellipsis key={`e-${p}`} disabled />);
                    }
                    items.push(
                      <Pagination.Item
                        key={p}
                        active={p === page}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Pagination.Item>
                    );
                    return items;
                  }, [])}
                <Pagination.Next
                  disabled={page >= totalPages || isFetching}
                  onClick={() => handlePageChange(page + 1)}
                />
              </Pagination>
            </div>
          )}
        </Col>
        <Col md={3} className="blog-sidebar py-4">
          <ListGroup variant="flush">
            <h2>Latest Articles</h2>
            {sidebarArticles.map((article) => (
              <LinkContainer to={`/articles/${article._id}`} key={article._id}>
                <ListGroup.Item>{article.title}</ListGroup.Item>
              </LinkContainer>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
