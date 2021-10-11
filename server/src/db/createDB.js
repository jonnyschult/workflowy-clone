const { Client } = require("pg");
const pool = require("./db");

const createDB = async (user, password) => {
  console.log(
    `Setting up data base with user: ${
      user === undefined ? "postgres" : user
    } and password: ${password === undefined ? "postgres" : password}.`
  );
  const client = new Client({
    user: user === undefined ? "postgres" : user,
    host: "localhost",
    password: password === undefined ? "postgres" : password,
    port: 5432,
  });

  console.log("Creating workflowy_demo database...");
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS workflowy_demo;`);
  await client.query(`CREATE DATABASE workflowy_demo;`);
  await client.end();
  console.log("Done creating Database");
  console.log("Creating tables...");
  const userResult = await pool.query(
    "CREATE TABLE user_account(id VARCHAR(36) NOT NULL, email varchar(50) NOT NULL UNIQUE, first_name varchar(30) NOT NULL, last_name varchar(30) NOT NULL, passwordhash varchar(300) NOT NULL, created_at varchar(15) NOT NULL, updated_at varchar(15) NOT NULL, PRIMARY KEY (id))"
  );
  console.log(userResult);
  const tasksResuts = await pool.query(
    "CREATE TABLE task(id  VARCHAR(36) NOT NULL, text TEXT NOT NULL, parent_id VARCHAR(36), priority INT DEFAULT 0, is_finished BOOLEAN, created_at varchar(15) NOT NULL, updated_at varchar(15) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (parent_id) REFERENCES task(id) );"
  );
  console.log(tasksResuts);
  const user_task_results = await pool.query(
    "CREATE TABLE user_task( user_id VARCHAR(36) NOT NULL, task_id VARCHAR(36) NOT NULL, owner_id VARCHAR(36) NOT NULL, CONSTRAINT user_task_pkey PRIMARY KEY (user_id, task_id));"
  );
  console.log(user_task_results);
  console.log("Done creating tables.");
};

if (module === require.main) {
  createDB(process.argv[2], process.argv[3]);
}
