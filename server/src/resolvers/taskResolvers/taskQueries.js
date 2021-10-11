const pool = require("../../db/db");
const { getQueryArgs, createNestedTasks } = require("../../../utils");

const getTask = async (_, args) => {
  try {
    const [queryString, valArray] = getQueryArgs("select", "task", args);
    const results = await pool.query(queryString, valArray);
    return results.rows[0];
  } catch (error) {
    return {
      success: false,
      message: "query failed",
      task: [],
    };
  }
};

const getTasks = async (_, args) => {
  try {
    const userId = args.userId;
    const results = await pool.query(
      "SELECT * FROM task INNER JOIN user_task ON task.id = user_task.task_id WHERE user_task.user_id = $1;",
      [userId]
    );
    return results.rows;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "query failed",
      task: [],
    };
  }
};

const taskQueries = {
  Query: {
    tasks: getTasks,
    task: getTask,
  },
};

module.exports = taskQueries;
