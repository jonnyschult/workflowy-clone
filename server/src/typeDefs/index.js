const query = require("./query");
const { taskType } = require("./types");

const typeDefs = [query, taskType];

module.exports = {
  typeDefs,
};
