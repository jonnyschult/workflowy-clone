const { gql } = require("apollo-server-express");

const taskType = gql`
  input TaskInput {
    id: String
    text: String
    parent_id: String
    owner_id: String
    position: Int
    is_finished: Boolean
    updated_at: String
    created_at: String
  }

  input CreateUserInput {
    first_name: String
    last_name: String
    email: String
    password: String
  }

  input ReorderTasksInput {
    id: String
    oldPosition: Int
    oldParentId: String
    newPosition: Int
    newParentId: String
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
    text: String
    parent_id: String
    position: Int
    is_finished: Boolean
    owner_id: String
    created_at: String
    updated_at: String
  }

  type TaskResponse {
    success: Boolean!
    message: String
    tasks: [Task]
    updatedPeerTasks: [Task]
  }

  type CreateUserResponse {
    success: Boolean!
    message: String
    token: String
    user: User
  }

  type LoginResponse {
    success: Boolean!
    message: String
    user: User
    token: String
  }
`;

module.exports = taskType;
