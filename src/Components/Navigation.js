import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav, NavDropdown, Navbar, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../services/appApi";
import { clearSession } from "../features/userSlice";
import logo from "../images/inkline-logo.png";
import { isAdminUser } from "../utils/admin";

function accountInitial(email) {
  return (email || "A").trim().charAt(0).toUpperCase();
}

function accountName(email) {
  if (!email) return "Account";
  return email.split("@")[0];
}

function Navigation() {
  const { user } = useSelector((state) => state.user);
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(clearSession());
    logoutUser().finally(() => {
      navigate("/");
    });
  }

  return (
    <Navbar className="site-navbar" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="brand-lockup">
            <img src={logo} alt="Inkline" />
            <span className="brand-name">Inkline</span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-3">
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link className="nav-login">Log in</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <>
                <LinkContainer to="/new-article">
                  <Nav.Link className="nav-write">Write</Nav.Link>
                </LinkContainer>
                <NavDropdown
                  id="account-dropdown"
                  align="end"
                  className="account-dropdown"
                  title={
                    <span className="account-trigger">
                      <span className="account-avatar" aria-hidden="true">
                        {accountInitial(user.email)}
                      </span>
                      <span className="account-trigger-label">Account</span>
                    </span>
                  }
                >
                  <div className="account-preview">
                    <span className="account-avatar account-avatar--lg" aria-hidden="true">
                      {accountInitial(user.email)}
                    </span>
                    <div className="account-preview-copy">
                      <strong>{accountName(user.email)}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <NavDropdown.Divider />
                  <LinkContainer to="/articles/me">
                    <NavDropdown.Item>My articles</NavDropdown.Item>
                  </LinkContainer>
                  {isAdminUser(user) && (
                    <LinkContainer to="/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <LinkContainer to="/new-article">
                    <NavDropdown.Item>Write a story</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as="button"
                    className="nav-logout"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing out…" : "Log out"}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
