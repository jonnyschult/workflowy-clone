import { gql } from "@apollo/client";

const LOGIN = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        first_name
        last_name
        email
        password
        created_at
        updated_at
      }
      token
    }
  }
`;

const GET_TASKS = gql`
  {
    getTasks {
      message
      success
      tasks {
        id
        text
        parent_id
        position
        owner_id
        is_finished
        created_at
        updated_at
      }
    }
  }
`;

const GET_USER = gql`
  {
    getUser {
      message
      success
      user {
        id
        first_name
        last_name
        email
        password
        created_at
        updated_at
      }
      token
    }
  }
`;

export { GET_TASKS, GET_USER, LOGIN };
