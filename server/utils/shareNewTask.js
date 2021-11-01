const getQueryArgs = require("./getQueryArgs");
const shareNewTask = async ({ pool, rootTaskId, newTaskId }) => {
  try {
    const [selectQueryString, selectValArray] = getQueryArgs(
      "select",
      "user_task",
      { task_id: rootTaskId }
    );
    const results = await pool.query(selectQueryString, selectValArray);
    const updatedShared = [];
    const ids = results.rows.map((item) => item.user_id);
    ids.forEach((id) => {
      const res = pool.query(
        "INSERT INTO user_task (user_id, task_id) VALUES($1, $2);",
        [id, newTaskId]
      );
      updatedShared.push(res.rows[0]);
    });
    await Promise.all(updatedShared);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = shareNewTask;
