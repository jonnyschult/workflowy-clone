const createNestedTasks = (tasks) => {
  return createChildren(
    tasks.filter((task) => task.parent_id === null),
    tasks.filter((task) => task.parent_id !== null)
  );
};

const createChildren = (topTasks, remainingTasks) => {
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

module.exports = createNestedTasks;
