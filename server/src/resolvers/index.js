const { taskMutations, taskQueries } = require("./taskResolvers");
const { userMutations, userQueries } = require("./userResolvers");

const resolvers = [taskQueries, taskMutations, userQueries, userMutations];

module.exports = {
  resolvers,
};
