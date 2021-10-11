const query = require("./query");
const { taskType } = require("./types");
const mutation = require("./mutations");

const typeDefs = [query, mutation, taskType];

module.exports = {
  typeDefs,
};
