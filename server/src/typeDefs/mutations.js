const { gql } = require("apollo-server-express");

const mutation = gql`
  type Mutation {
    createTask(task: TaskInput!, root_task_id: String): TaskResponse
    updateTask(updateTaskInput: TaskInput): TaskResponse
    shareTask(email: String!, task_id: String!): TaskResponse
    deleteTask(id: String): TaskResponse
    register(createUserInput: CreateUserInput): CreateUserResponse
  }
`;

module.exports = mutation;
