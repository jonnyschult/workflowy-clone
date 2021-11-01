import React from "react";
import Tasks from "./Tasks";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { tasksVar } from "../apollo/reactiveVars";
import { useReactiveVar } from "@apollo/client";

interface HomeProps {
  loading: Boolean;
}

interface ParamsType {
  id: string;
}

const Home: React.FC<HomeProps> = (props) => {
  const { id } = useParams<ParamsType>();
  const { loading } = props;
  const tasks = useReactiveVar(tasksVar);

  return (
    <Container>
      {loading ? (
        <Spinner as="span" animation="grow" variant="dark" />
      ) : tasks.length > 0 ? (
        <Tasks parentId={id ? id : null} insideTask={id ? true : false} />
      ) : (
        <h2>Create some tasks!</h2>
      )}
    </Container>
  );
};

export default Home;
