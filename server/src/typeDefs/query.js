const { gql } = require("apollo-server-express");

const query = gql`
  type Query {
    getTasks: TaskResponse
    login(email: String!, password: String!): LoginResponse
  }
`;

module.exports = query;
