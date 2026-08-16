import React from "react";
import { useSearchParams } from "react-router-dom";
import MainArticle from "../Components/MainArticle";
import ArticlePreview from "../Components/ArticlePreview";
import { Container, Spinner, ListGroup, Pagination } from "react-bootstrap";
import { useGetAllPostQuery } from "../services/appApi";
import { LinkContainer } from "react-router-bootstrap";
import { CATEGORIES } from "../constants/categories";

const PAGE_SIZE = 9;

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const category = searchParams.get("category") || "all";
  const { data, isLoading, isError, isFetching } = useGetAllPostQuery({
    page,
    limit: PAGE_SIZE,
    category,
  });
  const articles = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;
  const featuredArticle = page === 1 ? articles[0] : null;
  const gridArticles =
    page === 1 && featuredArticle
      ? articles.filter((article) => article._id !== featuredArticle._id)
      : articles;
  const sidebarArticles = articles.slice(0, 4);

  function updateParams({ nextPage = page, nextCategory = category }) {
    const params = {};
    if (nextCategory && nextCategory !== "all") params.category = nextCategory;
    if (nextPage > 1) params.page = String(nextPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCategoryChange(nextCategory) {
    updateParams({ nextPage: 1, nextCategory });
  }

  function handlePageChange(nextPage) {
    updateParams({ nextPage, nextCategory: category });
  }

  if (isError) {
    return (
      <div className="empty-state">
        <h1>Could not load stories</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="loading-state">
        <Spinner animation="border" variant="dark" role="status" />
        <h2 className="py-2">Loading stories…</h2>
      </div>
    );
  }

  return (
    <Container className="page-shell">
      <h1 className="banner__title">Latest stories</h1>
      <p className="banner__kicker">Engineering notes from the stack</p>
      <div className="category-bar" role="tablist" aria-label="Post categories">
        <button
          type="button"
          role="tab"
          aria-selected={category === "all"}
          className={`category-chip${category === "all" ? " is-active" : ""}`}
          onClick={() => handleCategoryChange("all")}
        >
          All
        </button>
        {CATEGORIES.map((item) => (
          <button
            type="button"
            role="tab"
            key={item.value}
            aria-selected={category === item.value}
            className={`category-chip${category === item.value ? " is-active" : ""}`}
            onClick={() => handleCategoryChange(item.value)}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>
      {featuredArticle && <MainArticle article={featuredArticle} />}

      <div className="feed-layout">
        <div>
          <div className="card-grid">
            {gridArticles.length > 0 ? (
              gridArticles.map((article) => (
                <ArticlePreview
                  article={article}
                  currentUserPost={false}
                  key={article._id}
                />
              ))
            ) : (
              <p>No blog posts available right now.</p>
            )}
          </div>
          {totalPages > 1 && (
            <div className="pager">
              <Pagination>
                <Pagination.Prev
                  disabled={page <= 1 || isFetching}
                  onClick={() => handlePageChange(page - 1)}
                />
                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .filter(
                    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
                  )
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
        </div>

        <aside className="sidebar-panel">
          <h2>On this page</h2>
          <ListGroup variant="flush">
            {sidebarArticles.map((article) => (
              <LinkContainer to={`/articles/${article._id}`} key={article._id}>
                <ListGroup.Item>{article.title}</ListGroup.Item>
              </LinkContainer>
            ))}
          </ListGroup>
        </aside>
      </div>
    </Container>
  );
}

export default Home;
