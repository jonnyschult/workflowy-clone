import { makeVar } from "@apollo/client";
import Task from "../types/task";
import User from "../types/user";

const tasksVar = makeVar<Task[]>([]);
const userVar = makeVar<User | null>(null);

export { tasksVar, userVar };
