const pool = require("../../db/db");

const getTasks = async (_, __, context) => {
  try {
    const { user, pool } = context;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const results = await pool.query(
      "SELECT * FROM task INNER JOIN user_task ON task.id = user_task.task_id WHERE user_task.user_id = $1;",
      [user.id]
    );
    if (results.rowCount === 0) {
      throw "You have no tasks. Please create some!";
    }
    return {
      success: true,
      message: "Success",
      tasks: results.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      tasks: [],
    };
  }
};

const taskQueries = {
  Query: {
    getTasks,
  },
};

module.exports = taskQueries;
