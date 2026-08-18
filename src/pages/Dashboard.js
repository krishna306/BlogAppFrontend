import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { useGetAdminOverviewQuery } from "../services/appApi";
import { isAdminUser } from "../utils/admin";
import { categoryLabel } from "../constants/categories";
import CoverImage from "../Components/CoverImage";
import "./Dashboard.css";

const AVATAR_TONES = ["teal", "amber", "coral", "indigo", "violet", "sky"];

function toneFor(value) {
  const text = String(value || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

function initialFor(email) {
  return (email || "U").trim().charAt(0).toUpperCase();
}

function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const canView = isAdminUser(user);
  const { data, isLoading, isError } = useGetAdminOverviewQuery(undefined, {
    skip: !canView,
  });
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const writers = useMemo(
    () => (data?.users || []).filter((item) => item.postCount > 0).length,
    [data]
  );

  const users = useMemo(() => {
    const list = data?.users || [];
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) => {
      const hay = `${item.email} ${item.name}`.toLowerCase();
      const titleHit = item.posts.some((post) =>
        post.title.toLowerCase().includes(term)
      );
      return hay.includes(term) || titleHit;
    });
  }, [data, query]);

  if (!canView) {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <div className="empty-state">
        <h1>Dashboard unavailable</h1>
        <p>You do not have access, or the server refused the request.</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="loading-state">
        <Spinner animation="border" variant="dark" role="status" />
        <h2 className="py-2">Loading dashboard…</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Container className="page-shell">
        <header className="dashboard-hero">
          <p className="dashboard-eyebrow">Studio</p>
          <h1>Newsroom snapshot</h1>
          <p>Every account on Inkline, and the stories they have sent to press.</p>
        </header>

        <div className="dashboard-stats">
          <article className="stat-card stat-card--users">
            <span>People</span>
            <strong>{data.totalUsers}</strong>
            <small>Signed-up accounts</small>
          </article>
          <article className="stat-card stat-card--posts">
            <span>Stories</span>
            <strong>{data.totalPosts}</strong>
            <small>Published on the feed</small>
          </article>
          <article className="stat-card stat-card--writers">
            <span>Writers</span>
            <strong>{writers}</strong>
            <small>Accounts with at least one piece</small>
          </article>
        </div>

        <div className="dashboard-toolbar">
          <input
            className="dashboard-search"
            type="search"
            value={query}
            placeholder="Search people or titles"
            onChange={(e) => setQuery(e.target.value)}
          />
          <p>{users.length} shown</p>
        </div>

        <div className="dashboard-list">
          {users.length === 0 ? (
            <p className="dashboard-empty-filter">No matching people.</p>
          ) : (
            users.map((item) => {
              const open = openId === item._id;
              const tone = toneFor(item.email);
              return (
                <section
                  className={`dashboard-user is-${tone}${open ? " is-open" : ""}`}
                  key={item._id}
                >
                  <button
                    type="button"
                    className="dashboard-user-head"
                    onClick={() => setOpenId(open ? null : item._id)}
                    aria-expanded={open}
                  >
                    <span className={`dash-avatar dash-avatar--${tone}`}>
                      {initialFor(item.email)}
                    </span>
                    <div className="dash-identity">
                      <strong>{item.email}</strong>
                      <span>
                        {item.name || item.email.split("@")[0]}
                      </span>
                    </div>
                    <b className="dash-count">
                      {item.postCount}
                      <em>{item.postCount === 1 ? "story" : "stories"}</em>
                    </b>
                    <span className="dash-chevron" aria-hidden="true">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                  {open && (
                    <ul className="dashboard-posts">
                      {item.posts.length === 0 ? (
                        <li className="dashboard-empty">No stories yet.</li>
                      ) : (
                        item.posts.map((post) => (
                          <li key={post._id}>
                            {post.image ? (
                              <CoverImage src={post.image} alt="" />
                            ) : (
                              <div className="dash-thumb-fallback" />
                            )}
                            <div>
                              <Link to={`/articles/${post._id}`}>
                                {post.title}
                              </Link>
                              <span>
                                <i className={`dash-chip dash-chip--${post.category || "other"}`}>
                                  {categoryLabel(post.category)}
                                </i>
                                {post.created_at ? ` ${post.created_at}` : ""}
                              </span>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
