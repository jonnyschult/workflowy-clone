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
  await pool.query(
    `CREATE TABLE user_account(
    id VARCHAR(36) NOT NULL, 
    email varchar(50) NOT NULL UNIQUE,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    passwordhash varchar(300) NOT NULL,
    created_at VARCHAR(17) NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    updated_at VARCHAR(17) NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    PRIMARY KEY (id)
);`
  );
  console.log("user_account table created.");
  await pool.query(
    `
    CREATE TABLE task(
    id VARCHAR(36) NOT NULL,
    text TEXT NOT NULL,
    parent_id VARCHAR(36),
    position INT DEFAULT 0,
    is_finished BOOLEAN,
    owner_id VARCHAR(36) REFERENCES user_account(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at VARCHAR(17) NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    updated_at VARCHAR(17) NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES task(id) ON DELETE CASCADE
);
`
  );
  console.log("task table created");

  await pool.query(
    `CREATE TABLE user_task(
    user_id VARCHAR(36) REFERENCES user_account (id) ON UPDATE CASCADE ON DELETE CASCADE,
    task_id VARCHAR(36) REFERENCES task (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_task_pkey PRIMARY KEY (user_id, task_id)
);`
  );
  console.log("user_task table created.");
  console.log("Done creating tables.");
  return;
};

if (module === require.main) {
  createDB(process.argv[2], process.argv[3]);
}
