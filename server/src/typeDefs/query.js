const { gql } = require("apollo-server");

const query = gql`
  type Query {
    tasks: [Task]
  }
`;

module.exports = query;
