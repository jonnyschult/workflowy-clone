import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import User from "../../types/user";
import Login from "./LoginForm";
import Register from "./RegisterForm";

interface LogRegProps {
  loginHandler: (user: User, token: any) => void;
}

const LoginRegisterModal: React.FC<LogRegProps> = (props) => {
  const [show, setShow] = useState(false);
  const [register, setRegister] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="light" onClick={handleShow}>
        Login/Register
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {register ? (
            <Register loginHandler={props.loginHandler} />
          ) : (
            <Login loginHandler={props.loginHandler} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setRegister(!register)}
          >
            {register
              ? "Already have an account? Login Here"
              : "Need an account? Register Here"}
          </p>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginRegisterModal;
