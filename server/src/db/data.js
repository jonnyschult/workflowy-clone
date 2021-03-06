const bcrypt = require("bcrypt");

const users = [
  {
    id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    email: "test@test.com",
    first_name: "Dante",
    last_name: "Alighieri",
    passwordhash: bcrypt.hashSync("testpass", 10),
  },
  {
    id: "78103b07-b619-487d-847f-db0f46ba56be",
    email: "test2@test.com",
    first_name: "Virgil",
    last_name: "Maro",
    passwordhash: bcrypt.hashSync("testpass", 10),
  },
];

const tasks = [
  {
    id: "1b292f64-48c8-4e65-845f-dfe676fe5fb2",
    text: "Welcome to Limbo. My name is Virgil.",
    parent_id: null,
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "8ea5dfe7-cb7c-48d2-8020-c8826de87a65",
    text: "Descend to the second circle? ↓",
    parent_id: null,
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "c41d7e41-be33-4a66-a41f-3fbebaf11e53",
    text: "Welcome to the second circle. Helen of Troy is over there, and so is Cleopatra!. ",
    parent_id: "8ea5dfe7-cb7c-48d2-8020-c8826de87a65",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "0ce555ac-b858-404e-94d6-401eaa3f12fe",
    text: "Descend to the third circle? Hope you're hungry! ↓",
    parent_id: "8ea5dfe7-cb7c-48d2-8020-c8826de87a65",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "a235e2e2-6777-4e8a-a3bf-7d14d6ce79c8",
    text: "Welcome to the third circle. We've got a Pondarosa and it is staffed by Ciaccoo.",
    parent_id: "0ce555ac-b858-404e-94d6-401eaa3f12fe",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "066d41f6-3d2d-4a51-b626-141f77345fe7",
    text: "Descend to the fourth circle? Feeling greedy, huh? ↓",
    parent_id: "0ce555ac-b858-404e-94d6-401eaa3f12fe",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "2322116f-fbd3-4fa7-b529-afc959fc065f",
    text: "Welcome to the fourth circle. Watch your pockets!",
    parent_id: "066d41f6-3d2d-4a51-b626-141f77345fe7",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "5f7a095d-6951-4462-93c0-4ca37faf2920",
    text: "Descend to the fifth circle? Don't get mad! ↓",
    parent_id: "066d41f6-3d2d-4a51-b626-141f77345fe7",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "8c990091-5096-4dab-b38c-d3ff863ab56b",
    text: "Welcome to the fifth circle. Please stay calm. It's a long journey.",
    parent_id: "5f7a095d-6951-4462-93c0-4ca37faf2920",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "627d47b0-7d2f-4995-a0d9-26c8af1600f3",
    text: "Descend to the sixth circle? But, but, that's heresy, my friend! ↓",
    parent_id: "5f7a095d-6951-4462-93c0-4ca37faf2920",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "13ec4cc6-1ef3-448d-9a4c-47849702a1df",
    text: "Welcome to the sixth circle. Epicurus is here, and since it's 2021, I'm guessing Dante would be pleased to see Richard Dawkins and Martin Luther are arguing over there.",
    parent_id: "627d47b0-7d2f-4995-a0d9-26c8af1600f3",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "23afdf4b-3f76-4458-b639-0d1cefedfce8",
    text: "Descend to the seventh circle? I generally don't go this far. Too much nesting and violence. ↓",
    parent_id: "627d47b0-7d2f-4995-a0d9-26c8af1600f3",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "4e28ff07-a25f-4c66-8284-b72625335ae0",
    text: "Welcome to the seventh circle. Alexander and his imperialist types are here. Joe Rogan runs the intercom.",
    parent_id: "23afdf4b-3f76-4458-b639-0d1cefedfce8",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "e329b64c-16f0-4219-989b-92449b39067a",
    text: "Descend to the eigth circle? It's mostly just insurance companies. ↓",
    parent_id: "23afdf4b-3f76-4458-b639-0d1cefedfce8",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "8fa95676-7a30-4ea7-8cfe-8e45733ba908",
    text: "Welcome to the eigth circle. Bernie Madoff is in charge. Jim Jones is secretary.",
    parent_id: "e329b64c-16f0-4219-989b-92449b39067a",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
  {
    id: "1504a549-8d8b-42c7-b44d-5976d4e37eed",
    text: "Descend to the ninth circle? I hope you brought a coat.↓",
    parent_id: "e329b64c-16f0-4219-989b-92449b39067a",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 1,
  },
  {
    id: "cf721e11-dfbc-4875-af27-fda20898b80e",
    text: "Welcome to the ninth level. There is no further to go, unless you want to create more circles of hell. If you look to your right, you might be lucky enough to see Satan chewing up a frozen Judas.",
    parent_id: "1504a549-8d8b-42c7-b44d-5976d4e37eed",
    owner_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
    is_finished: false,
    position: 0,
  },
];

const taskRelations = [
  {
    task_id: "1b292f64-48c8-4e65-845f-dfe676fe5fb2",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "8ea5dfe7-cb7c-48d2-8020-c8826de87a65",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "c41d7e41-be33-4a66-a41f-3fbebaf11e53",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "0ce555ac-b858-404e-94d6-401eaa3f12fe",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "a235e2e2-6777-4e8a-a3bf-7d14d6ce79c8",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "066d41f6-3d2d-4a51-b626-141f77345fe7",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "2322116f-fbd3-4fa7-b529-afc959fc065f",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "5f7a095d-6951-4462-93c0-4ca37faf2920",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "8c990091-5096-4dab-b38c-d3ff863ab56b",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "627d47b0-7d2f-4995-a0d9-26c8af1600f3",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "13ec4cc6-1ef3-448d-9a4c-47849702a1df",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "23afdf4b-3f76-4458-b639-0d1cefedfce8",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "4e28ff07-a25f-4c66-8284-b72625335ae0",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "e329b64c-16f0-4219-989b-92449b39067a",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "8fa95676-7a30-4ea7-8cfe-8e45733ba908",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "1504a549-8d8b-42c7-b44d-5976d4e37eed",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
  {
    task_id: "cf721e11-dfbc-4875-af27-fda20898b80e",
    user_id: "b83f5df1-c8c1-4286-8533-95df7e387ea4",
  },
];

module.exports = {
  tasks,
  users,
  taskRelations,
};
