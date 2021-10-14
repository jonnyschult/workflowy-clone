const getQueryArgs = require("./getQueryArgs");
const shareNewTask = async ({ pool, root_task_id, new_task_id }) => {
  try {
    const [selectQueryString, selectValArray] = getQueryArgs(
      "select",
      "user_task",
      { task_id: root_task_id }
    );
    const results = await pool.query(selectQueryString, selectValArray);
    const ids = results.rows.map((item) => item.user_id);
    for (let i = 0; i < ids.length; i++) {
      await pool.query(
        "INSERT INTO user_task (user_id, task_id) VALUES($1, $2);",
        [ids[i], new_task_id]
      );
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = shareNewTask;
