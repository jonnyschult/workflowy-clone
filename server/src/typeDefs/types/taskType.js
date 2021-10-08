const { gql } = require("apollo-server");

const taskType = gql`
  type Task {
    id: String!
    text: String!
    parent_id: String
    order: Int
    finished: Boolean
    created_at: Int
  }
`;

module.exports = taskType;
