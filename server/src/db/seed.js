const pool = require("../db/db");
const getQueryArgs = require("../../utils/getQueryArgs");
const { tasks, users, taskRelations } = require("./data");

const seed = async () => {
  console.log("Beginning seed");
  console.log("Adding users...");
  for (let i = 0; i < users.length; i++) {
    const [queryString, valArray] = getQueryArgs(
      "insert",
      "user_account",
      users[i]
    );
    console.log(queryString, valArray);
    await pool.query(queryString, valArray);
  }
  console.log("Added users. Now adding tasks...");
  for (let i = 0; i < tasks.length; i++) {
    const [queryString, valArray] = getQueryArgs("insert", "task", tasks[i]);
    await pool.query(queryString, valArray);
  }

  console.log("Added tasks. Now creating relations...");
  for (let i = 0; i < taskRelations.length; i++) {
    const [queryString, valArray] = getQueryArgs(
      "insert",
      "user_task",
      taskRelations[i]
    );
    await pool.query(queryString, valArray);
  }
  console.log("Seeding done.");
};

if (module === require.main) {
  console.log(module, require.main);
  seed();
}
