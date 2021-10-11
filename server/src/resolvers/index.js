const { taskMutations, taskQueries } = require("./taskResolvers");

const resolvers = [taskQueries, taskMutations];

module.exports = {
  resolvers,
};
