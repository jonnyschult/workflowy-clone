const { gql } = require("apollo-server-express");

const mutation = gql`
  type Mutation {
    createTask(createTaskInput: CreateTaskInput): CreateTaskResponse
  }
`;

module.exports = mutation;

//   text: String;
//   parent_id: String;
//   priority: Int;
//   is_finished: Boolean;
//   created_at: String;
//   id: String;
