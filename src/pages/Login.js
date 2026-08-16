import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useLoginUserMutation } from "../services/appApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isError, isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    login({ email, password }).then(({ error }) => {
      if (!error) {
        navigate("/");
      }
    });
  }

  return (
    <Container className="page-shell">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-kicker">Sign in to Inkline</p>
        <Form onSubmit={handleLogin}>
          {isError && (
            <p className="auth-error">{error?.data || "Could not sign in."}</p>
          )}
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div className="auth-actions">
            <Button className="btn-accent" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </Form>
        <p className="auth-switch">
          New to Inkline? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </Container>
  );
}

export default Login;
