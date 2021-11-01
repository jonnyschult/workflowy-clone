import { cloneDeep } from "lodash";
import { tasksVar } from "../apollo/reactiveVars";
import Task from "../types/task";

interface updateVarParams {
  key: string;
  task: Task;
  secondTask?: Task;
  text?: string;
}

const updateVar = ({ key, task, secondTask, text }: updateVarParams) => {
  const tasks = cloneDeep(tasksVar());
  if (key === "enter") {
    const newTask = secondTask!;
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        t.text = text!;
        return t;
      } else if (
        //updates the positions of the tasks
        t.parent_id === newTask.parent_id &&
        t.position >= newTask.position
      ) {
        t.position = t.position + 1;
        return t;
      }
      return t;
    });
    return [...updatedTasks, newTask];
  } else if (key === "tab") {
    //resets position for the tasks as it jumps levels
    const newParent = secondTask;
    return tasks.map((t) => {
      console.log("Sorting it");
      if (t.id === task.id) {
        t.parent_id = newParent!.id!;
        t.position = 0;
        return t;
      } else if (t.parent_id === newParent!.id) {
        t.position = t.position + 1;
        return t;
      } else if (t.parent_id === task.parent_id && t.position > task.position) {
        t.position = t.position - 1;
      }
      return t;
    });
  } else if (key === "unTab") {
    //resets position for the tasks as it jumps levels
    const oldParentTask = secondTask;
    return tasks.map((t) => {
      if (t.id === task.id) {
        t.parent_id = oldParentTask!.parent_id;
        t.position = oldParentTask!.position + 1;
        return t;
      } else if (
        t.parent_id === oldParentTask?.parent_id &&
        t.position > oldParentTask.position
      ) {
        t.position = t.position + 1;
        return t;
      } else if (t.parent_id === task.parent_id && t.position > task.position) {
        t.position = t.position - 1;
      }
      return t;
    });
  } else if (key === "inputText") {
    return tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      }
      return t;
    });
  }
};

export default updateVar;
