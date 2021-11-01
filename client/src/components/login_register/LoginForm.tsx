import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { LOGIN } from "../../apollo/queryDefs";
import User from "../../types/user";

interface LoginProps {
  loginHandler: (user: User, token: any) => void;
}
let password = "";
let email = "";

const Login: React.FC<LoginProps> = (props) => {
  const [message, setMessage] = useState<string>("");
  const [login, { loading, data, error }] = useLazyQuery(LOGIN, {
    variables: {
      email,
      password,
    },
    onCompleted(data) {
      console.log(data);
      props.loginHandler(data.login.user, data.login.token);
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        if (password.length >= 8) {
          login();
        } else {
          console.log(password.length);
          setMessage("Your password must be at least 8 characters.");
          setTimeout(() => {
            setMessage("");
          }, 1400);
        }
      }}
    >
      <h4>Login</h4>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => {
            email = e.target.value.toLowerCase().trim();
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => (password = e.target.value.toLowerCase().trim())}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Logging In...{" "}
          </>
        ) : (
          "Login"
        )}
      </Button>

      {message ? <Alert>{message}</Alert> : <></>}
      {data ? <Alert>{data.login.message}</Alert> : <></>}
      {error ? <Alert>{error.message}</Alert> : <></>}
    </Form>
  );
};

export default Login;
