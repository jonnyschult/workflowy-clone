import Task from "../types/task";
import _ from "lodash";

const createNestedTasks = (tasks: Task[]) => {
  // This is an unfortunate necessity of a confluence of best practices, one of which was going to have to be broken. See more in the README.
  // TLDR: Apollo gql returns non-extensible objects, which means I couldn't create the 'children' property for each task w/children.
  // I couldn't structure the object on the server side because it creates a tree of unknown depth, which can't be recursively queried with a gql query.
  tasks = _.cloneDeep(tasks);
  return createChildren(
    tasks.filter((task) => task.parent_id === null),
    tasks.filter((task) => task.parent_id !== null)
  );
};

const createChildren = (topTasks: Task[], remainingTasks: Task[]) => {
  const returnVals = topTasks.map((topTask) => {
    const children = remainingTasks.filter(
      (task) => task.parent_id === topTask.id
    );
    if (children.length > 0) {
      remainingTasks = remainingTasks.filter(
        (task) => task.parent_id !== topTask.id
      );
      topTask.children = createChildren(children, remainingTasks);
      return topTask;
    } else {
      return topTask;
    }
  });
  return returnVals;
};

export default createNestedTasks;
