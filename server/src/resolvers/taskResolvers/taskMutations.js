const { getQueryArgs, shareNewTask } = require("../../../utils/");

const createTask = async (_, args, context) => {
  try {
    const { user, pool } = context;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const { task, rootTaskId } = args;
    task.owner_id = user.id;
    const [queryString, valArray] = getQueryArgs("insert", "task", task);
    const results = await pool.query(queryString, valArray);
    await pool.query(
      "INSERT INTO user_task (user_id, task_id) VALUES($1, $2);",
      [user.id, task.id]
    );

    //Updates related tasks priorities so they display right.
    const peerTasksResults = await pool.query(
      "SELECT * FROM task WHERE parent_id = $1 AND id != $2",
      [task.parent_id, task.id]
    );
    const peerTasks = peerTasksResults.rows;
    const peersPromises = [];
    peerTasks.forEach((peer) => {
      if (peer.position > task.position) {
        const res = pool.query(
          "UPDATE task SET position = $1 WHERE id = $2 RETURNING *",
          [peer.position + 1, peer.id]
        );
        peersPromises.push(res);
      }
    });

    let updatedPeers = await Promise.all(peersPromises);
    updatedPeers = updatedPeers.map((peer) => peer.rows).flat();

    //If the task is created in a shared task tree, the task is then associated with all users who have access to that task tree.
    if (rootTaskId !== undefined) {
      const didShare = await shareNewTask({
        pool,
        rootTaskId,
        newTaskId: task.id,
      });
      if (!didShare) {
        throw "Task created, but failed to share it with other users.";
      }
    }

    return {
      success: true,
      message: "Task created!",
      tasks: results.rows,
      updatedPeerTasks: updatedPeers,
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
    const { task } = args;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const [selectQueryString, selectValArray] = getQueryArgs(
      "select",
      "user_task",
      {
        task_id: task.id,
        user_id: user.id,
      }
    );
    const results = await pool.query(selectQueryString, selectValArray);
    if (results.rows.length === 0) {
      throw "You must be associated with this task to edit it.";
    }

    //Updates children is_finished status to accord with parent. Or if child is changed to unfinished, that filters up the tree of direct parents
    let updatedRows = [];
    if (task.is_finished !== undefined) {
      let familyTasksResults;
      //moves up the tree if the task is marked un-completed and down the tree if is marked complete
      if (task.is_finished) {
        familyTasksResults = await pool.query(
          `WITH RECURSIVE children AS ( SELECT * FROM task WHERE id = $1 UNION SELECT t.* FROM task t INNER JOIN children c ON c.id = t.parent_id ) SELECT id FROM children;`,
          [task.id]
        );
      } else {
        familyTasksResults = await pool.query(
          `WITH RECURSIVE parent AS ( SELECT * FROM task WHERE id = $1 UNION SELECT t.* FROM task t INNER JOIN parent p ON p.parent_id = t.id ) SELECT id FROM parent;`,
          [task.id]
        );
      }
      const familyTasks = familyTasksResults.rows;
      const promiseArr = [];
      familyTasks.forEach((familyTask) => {
        const [updateQueryString, updateValArray] = getQueryArgs(
          "update",
          "task",
          { is_finished: task.is_finished, id: familyTask.id }
        );
        const res = pool.query(updateQueryString, updateValArray);
        promiseArr.push(res);
      });
      //Speedier than awaiting each call
      updatedRows = await Promise.all(promiseArr);
      updatedRows = updatedRows.map((t) => t.rows).flat();
    } else {
      const [updateQueryString, updateValArray] = getQueryArgs(
        "update",
        "task",
        task
      );
      const updateResults = await pool.query(updateQueryString, updateValArray);
      updatedRows = updateResults.rows;
    }

    return {
      success: true,
      message: "Task Updated.",
      tasks: updatedRows,
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
    const tasksToShare = tasksResults.rows;

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
    const recipient = userResults.rows[0];

    if (recipient === undefined) {
      throw "There is no user with that email.";
    }

    const [userTaskQueryStr, userTaskValArr] = getQueryArgs(
      "select",
      "user_task",
      { user_id: recipient.id }
    );
    const userTaskResults = await pool.query(userTaskQueryStr, userTaskValArr);

    const alreadySharedIds = userTaskResults.rows.map(
      (userTask) => userTask.task_id
    );

    //regular for loop for async reasons
    for (let i = 0; i < tasksToShare.length; i++) {
      //ensures query doesn't error out due to unique key constraint.
      if (!alreadySharedIds.includes(tasksToShare[i].id)) {
        const [addQueryString, addValArray] = getQueryArgs(
          "insert",
          "user_task",
          {
            user_id: recipient.id,
            task_id: tasksResults.rows[i].id,
          }
        );
        await pool.query(addQueryString, addValArray);
      }
    }

    return {
      success: true,
      message: `Task Shared`,
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
    const { task } = args;

    if (user === null) {
      throw "You must be logged in to perform this action";
    }
    const [selectQueryString, selectValArray] = getQueryArgs(
      "select",
      "user_task",
      {
        task_id: task.id,
        user_id: user.id,
      }
    );
    const selectResults = await pool.query(selectQueryString, selectValArray);
    if (selectResults.rows.length === 0) {
      throw "You must be associated with this task to delete";
    }
    const [deleteQueryString, deleteValArray] = getQueryArgs("delete", "task", {
      id: task.id,
    });
    const results = await pool.query(deleteQueryString, deleteValArray);

    //Updates related tasks priorities so they display right.
    const peerTasksResults = await pool.query(
      "SELECT * FROM task WHERE parent_id = $1",
      [task.parent_id]
    );
    const peerTasks = peerTasksResults.rows;
    const updatedPeerTasks = [];
    peerTasks.forEach((peer) => {
      if (peer.position > task.position) {
        const res = pool.query(
          "UPDATE task SET position = $1 WHERE id = $2 RETURNING *",
          [peer.position - 1, peer.id]
        );
        updatedPeerTasks.push(res.rows[0]);
      }
    });

    await Promise.all(updatedPeerTasks);

    return {
      success: true,
      message: "Task deleted.",
      tasks: results.rows,
      updatedPeerTasks,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      task: null,
      updatedPeerTasks: null,
    };
  }
};

const reorderTasks = async (_, args, context) => {
  try {
    const { user, pool } = context;
    const { id, oldPosition, oldParentId, newPosition, newParentId } =
      args.reorderTasksInput;
    if (user === null) {
      throw "You must be logged in to perform this action";
    }

    const peersPromises = [];

    const newPeersResults = await pool.query(
      "SELECT id, position FROM task WHERE parent_id = $1 AND id != $2",
      [newParentId, id]
    );
    const newPeers = newPeersResults.rows;
    const oldPeersResults = await pool.query(
      "SELECT id, position FROM task WHERE parent_id = $1 AND id != $2",
      [oldParentId, id]
    );
    const oldPeers = oldPeersResults.rows;

    newPeers.forEach((newPeer) => {
      if (newPeer.position >= newPosition) {
        const res = pool.query(
          "UPDATE task SET position = $1 WHERE id = $2 RETURNING *",
          [newPeer.position + 1, newPeer.id]
        );
        peersPromises.push(res);
      }
    });
    oldPeers.forEach((oldPeer) => {
      if (oldPeer.position > oldPosition) {
        const res = pool.query(
          "UPDATE task SET position = $1 WHERE id = $2 RETURNING *",
          [oldPeer.position - 1, oldPeer.id]
        );
        peersPromises.push(res);
      }
    });

    let updatedPeers = await Promise.all(peersPromises);
    updatedPeers = updatedPeers.map((peer) => peer.rows).flat();

    return {
      success: true,
      message: "Positions Updated.",
      tasks: updatedPeers,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      tasks: null,
    };
  }
};

const taskMutations = {
  Mutation: {
    createTask,
    deleteTask,
    updateTask,
    shareTask,
    reorderTasks,
  },
};

module.exports = taskMutations;
