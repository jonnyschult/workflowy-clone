const { gql } = require("apollo-server-express");

const query = gql`
  type Query {
    tasks(userId: String!): [Task]
    task(id: String!): Task
  }
`;

module.exports = query;
