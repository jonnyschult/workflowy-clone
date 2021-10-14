const { gql } = require("apollo-server-express");

const taskType = gql`
  input TaskInput {
    id: String
    text: String
    parent_id: String
    priority: Int
    is_finished: Boolean
  }

  input CreateUserInput {
    first_name: String
    last_name: String
    email: String
    password: String
  }

  type User {
    id: String
    first_name: String
    last_name: String
    email: String
    password: String
    created_at: String
    updated_at: String
  }

  type Task {
    id: String
    text: String!
    parent_id: String
    priority: Int
    is_finished: Boolean
    owner_id: String
    created_at: String
    updated_at: String
  }

  type TaskResponse {
    success: Boolean!
    message: String
    tasks: [Task]
  }

  type CreateUserResponse {
    success: Boolean!
    message: String
    token: String
  }

  type LoginResponse {
    success: Boolean!
    message: String
    user: User
    token: String
  }
`;

module.exports = taskType;
