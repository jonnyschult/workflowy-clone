const { gql } = require("apollo-server-express");

const mutation = gql`
  type Mutation {
    createTask(task: TaskInput!, rootTaskId: String): TaskResponse
    updateTask(task: TaskInput): TaskResponse
    shareTask(email: String!, task_id: String!): TaskResponse
    deleteTask(task: TaskInput): TaskResponse
    register(createUserInput: CreateUserInput): CreateUserResponse
    reorderTasks(reorderTasksInput: ReorderTasksInput!): TaskResponse
  }
`;

module.exports = mutation;
