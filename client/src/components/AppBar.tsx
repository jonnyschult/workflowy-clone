import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import LoginRegisterModal from "./login_register/LoginRegisterModal";
import { useHistory } from "react-router";
import { userVar } from "../apollo/reactiveVars";
import { useReactiveVar } from "@apollo/client";
import User from "../types/user";

interface AppBarProps {
  loginHandler: (user: User, token: any) => void;
  logoutHandler: () => void;
}

const ButtonAppBar: React.FC<AppBarProps> = (props) => {
  const { loginHandler, logoutHandler } = props;
  const loggedIn = useReactiveVar(userVar);
  const history = useHistory();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Workflowy-Clone</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => history.push(`/`)}>Home</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            {loggedIn ? (
              <Button onClick={logoutHandler} variant="light">
                Logout
              </Button>
            ) : (
              <LoginRegisterModal loginHandler={loginHandler} />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ButtonAppBar;
