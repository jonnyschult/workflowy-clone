const tasks = require("../db/seed");

const tasksResovler = {
  Query: {
    tasks: () => tasks,
  },
};

module.exports = tasksResovler;
