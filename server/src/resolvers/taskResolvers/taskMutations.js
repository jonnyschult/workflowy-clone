const pool = require("../../db/db");
const getQueryArgs = require("../../../utils/getQueryArgs");
const { v4: uuid } = require("uuid");

const createTask = async (_, args) => {
  try {
    const task = args.createTaskInput;
    task.created_at = new Date().getTime().toString();
    task.updated_at = new Date().getTime().toString();
    task.id = uuid();
    console.log(task);
    const [queryString, valArray] = getQueryArgs("insert", "task", task);
    const results = await pool.query(queryString, valArray);
    return {
      success: true,
      message: "Task created!",
      task: results.rows[0],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "query failed",
      task: null,
    };
  }
};

const taskMutations = {
  Mutation: {
    createTask: createTask,
  },
};

module.exports = taskMutations;
