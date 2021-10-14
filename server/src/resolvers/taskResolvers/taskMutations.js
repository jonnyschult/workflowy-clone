const { getQueryArgs, shareNewTask } = require("../../../utils/");
const { v4: uuid } = require("uuid");

const createTask = async (_, args, context) => {
  try {
    const { user, pool } = context;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const { task, root_task_id } = args;
    task.id = uuid();
    task.owner_id = user.id;
    const [queryString, valArray] = getQueryArgs("insert", "task", task);
    const results = await pool.query(queryString, valArray);
    await pool.query(
      "INSERT INTO user_task (user_id, task_id) VALUES($1, $2);",
      [user.id, task.id]
    );

    //If the task is created in a shared task tree, the task is then associated with all users who have access to that task tree.
    if (root_task_id !== undefined) {
      const didShare = shareNewTask({
        pool,
        root_task_id,
        new_task_id: task.id,
      });
      if (!didShare) {
        throw "Task created, but failed to share it with other users.";
      }
    }

    return {
      success: true,
      message: "Task created!",
      tasks: results.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      task: null,
    };
  }
};

const updateTask = async (_, args, context) => {
  try {
    const { user, pool } = context;
    const updateInfo = args.updateTaskInput;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const [selectQueryString, selectValArray] = getQueryArgs(
      "select",
      "user_task",
      {
        task_id: updateInfo.id,
        user_id: user.id,
      }
    );
    const results = await pool.query(selectQueryString, selectValArray);
    if (results.rowsCount === 0) {
      throw "You must be associated with this task to edit it.";
    }
    const [updateQueryString, updateValArray] = getQueryArgs(
      "update",
      "task",
      updateInfo
    );
    const updateResults = await pool.query(updateQueryString, updateValArray);

    return {
      success: true,
      message: "Task Updated.",
      tasks: updateResults.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      task: null,
    };
  }
};

const shareTask = async (_, args, context) => {
  try {
    const { user, pool } = context;
    const { email, task_id } = args;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }

    const tasksResults = await pool.query(
      `WITH RECURSIVE children AS ( SELECT * FROM task WHERE id = $1 UNION SELECT t.* FROM task t INNER JOIN children c ON c.id = t.parent_id ) SELECT * FROM children;`,
      [task_id]
    );
    console.log(tasksResults.rows[0]);
    if (tasksResults.rows[0].owner_id !== user.id) {
      throw "You must be the owner of this task to share it.";
    }

    const [selectUserString, selectUserArray] = getQueryArgs(
      "select",
      "user_account",
      {
        email,
      }
    );
    const userResults = await pool.query(selectUserString, selectUserArray);

    //regular for loop for async reasons
    for (let i = 0; i < tasksResults.rows.length; i++) {
      const [addQueryString, addValArray] = getQueryArgs(
        "insert",
        "user_task",
        {
          user_id: userResults.rows[0].id,
          task_id: tasksResults.rows[i].id,
        }
      );
      await pool.query(addQueryString, addValArray);
    }

    return {
      success: true,
      message: `User with the ${email} email has been add to the task.`,
      tasks: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      task: null,
    };
  }
};

const deleteTask = async (_, args, context) => {
  try {
    const { user, pool } = context;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const [selectQueryString, selectValArray] = getQueryArgs(
      "select",
      "task",
      args
    );
    const results = await pool.query(selectQueryString, selectValArray);
    if (results.rows[0].owner_id !== user.id) {
      throw "You must be the owner of this task to delete";
    }
    await getQueryArgs("delete", "task", args);
    const [deleteQueryString, deleteValArray] = getQueryArgs(
      "delete",
      "task",
      args
    );
    await pool.query(deleteQueryString, deleteValArray);

    return {
      success: true,
      message: "Task deleted.",
      tasks: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      task: null,
    };
  }
};

const taskMutations = {
  Mutation: {
    createTask,
    deleteTask,
    updateTask,
    shareTask,
  },
};

module.exports = taskMutations;
