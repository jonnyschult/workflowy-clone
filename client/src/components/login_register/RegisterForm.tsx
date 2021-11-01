import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import User from "../../types/user";

const REGISTER = gql`
  mutation register($createUserInput: CreateUserInput) {
    register(createUserInput: $createUserInput) {
      message
      success
      token
    }
  }
`;

interface RegisterProps {
  loginHandler: (user: User, token: any) => void;
}

const Register: React.FC<RegisterProps> = (props) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [register, { loading, error, data }] = useMutation(REGISTER, {
    variables: {
      createUserInput: {
        email,
        password,
        first_name,
        last_name,
      },
    },
    onCompleted(data) {
      props.loginHandler(data.register.user, data.register.token);
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        register();
      }}
    >
      <h4>Register an account</h4>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="input"
          placeholder="Jan"
          onChange={(e) => setFirstName(e.target.value.toLowerCase().trim())}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="input"
          placeholder="Jones"
          onChange={(e) => setLastName(e.target.value.trim())}
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
            Registering...{" "}
          </>
        ) : (
          "Register"
        )}
      </Button>
      {data ? <Alert>{data.register.message}</Alert> : <></>}
      {error ? <Alert>{error.message}</Alert> : <></>}
    </Form>
  );
};

export default Register;
