import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useSignupUserMutation } from "../services/appApi";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { isLoading, isError, error }] = useSignupUserMutation();

  function handleSignup(e) {
    e.preventDefault();
    signup({ email, password }).then(({ error }) => {
      if (!error) {
        navigate("/");
      }
    });
  }

  return (
    <Container className="page-shell">
      <div className="auth-card">
        <h1 className="auth-title">Join Inkline</h1>
        <p className="auth-kicker">Create an account to publish stories</p>
        <Form onSubmit={handleSignup}>
          {isError && (
            <p className="auth-error">{error?.data || "Could not create account."}</p>
          )}
          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div className="auth-actions">
            <Button className="btn-accent" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create account"}
            </Button>
          </div>
        </Form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </Container>
  );
}

export default Signup;
