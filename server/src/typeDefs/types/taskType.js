const { gql } = require("apollo-server-express");

const taskType = gql`
  input CreateTaskInput {
    text: String!
    parent_id: String
    priority: Int
    is_finished: Boolean
  }

  type Task {
    id: String
    text: String!
    parent_id: String
    priority: Int
    is_finished: Boolean
    created_at: String
  }

  type CreateTaskResponse {
    success: Boolean!
    message: String
    task: Task
  }
`;

module.exports = taskType;
