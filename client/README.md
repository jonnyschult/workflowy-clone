# Workflowy Clone

This project was created for a few purposes. First, to learn GraphQL with Apollo Server. Second, to learn state management with Apollo Client 3. And third, to study the structure and design of nesting data. Workflowy is self described as 'fractal', by which they mean that data can be infinitely nested and that the children data have the same properties as the parent. That is, all parts have the same shape as the whole, no matter how deeply nested the part is. In this case, that means a task can have children which are also tasks which can also have children _ad infinitum_.

## Tech Stack

### Frontend

- TypeScript
- React
- Apollo Client 3
- React Bootstrap

### Backend

- Node js
- Apollo Server
- Express
- GraphQL
- Postgres

## Getting Started

In the server directory, add a .env file with DATABASE_URL, PORT and JWT_SECRET properties, such as

- DATABASE_URL = postgres://postgres:postgres@localhost:5432/workflowy_demo
- PORT = 4040
- JWT_SECRET = gowiththeflowy

**Make sure you create a database url which works on your machine.**

Then run the following commands:

`yarn install` / `npm install`

This app requires Postgres to run. If you have postgres installed and you have a user 'postgres' with a password 'postgres' you can run the following:

`yarn createDB` / `npm createDB`

If you have a different user or password, you can add two arguments two the end of the command like `yarn createDB user password`. This example would connect to postgres with a username 'user' and password 'password'.

If this fails, you can use the workflowy.psql file in the server directory to create the database in a terminal connected to postgres.

To seed the database, run,

`yarn seed` / `npm seed`

To start the server, run,

`yarn dev` / `npm dev`

In the client directory, run the following commands:

`yarn install` / `npm install`

`yarn start` / `npm start`

You can then login with the following credential:

- email: test@test.com
- password: testpass

## Notes on the project

The point of this app was not to develop a slick UI, and this app does not. It has some key functionality, such as 'tab' to nest a task, 'shift+tab' to un-nest a task, 'enter' to create a task, 'delete' to remove a task, and any input key to update a task, which only fires after 700ms of no typing. This is to avoid unnecessary api calls.

One of the technical challenges of this project was querying for nested tasks. GraphQL and Apollo don't allow for recursive querying of n length. The depth of the query must be specified. This left two options. The first option was to create queries on the front end when the user clicked into a nested task; a pagination strategy. This had the down side of making it difficult to display all tasks at once, as this would require the frontend to know when all tasks have been queried. That is, the client would have to know when each task has retrieved all of it's children. This could be time consuming and provide a lackluster user experience. It is also a more heavily engineered solution. As such, I preferred the second option, which was to store the data as a one-dimensional array of tasks which contained nesting data. In this case, each task has a 'parent_id' property which is null if it is a top level task and otherwise holds the id of the task under which it is nested. On the frontend, the React component which displays tasks has itself as an element if the task it is displaying has children and, in short, passes the children as a prop. This allows the UI to display the tasks as nested despite the data being in a one dimensional array.
