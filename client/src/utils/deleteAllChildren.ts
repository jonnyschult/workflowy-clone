import Task from "../types/task";

const childrenIds: string[] = [];
const findChildren = (parentId: string, tasks: Task[]) => {
  tasks.forEach((task) => {
    if (task.parent_id === parentId) {
      childrenIds.push(task.id!);
      findChildren(task.id!, tasks);
    }
  });
};
