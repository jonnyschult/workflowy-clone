import React from "react";
import { useMutation } from "@apollo/client";
import { tasksVar } from "../apollo/reactiveVars";
import { DELETE_TASK, UPDATE_TASK } from "../apollo/mutationDefs";
import Task from "../types/task";
import { Dropdown } from "react-bootstrap";
import ShareModal from "./ShareModal";

interface OptionsProps {
  task: Task;
  hasChildren: boolean;
}

const Options: React.FC<OptionsProps> = (props) => {
  const { task, hasChildren } = props;

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted(data) {
      const updatedTasks = data.updateTask.tasks;
      const updatedTasksIds = updatedTasks.map((t: Task) => t.id);
      const filteredTasks = tasksVar().filter(
        (t) => !updatedTasksIds.includes(t.id)
      );
      //updates state using Reactive Variable with useReactiveHook in Home
      tasksVar([...updatedTasks, ...filteredTasks]);
    },
    onError(error) {
      console.log(error);
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted(data) {
      const currentTasks = tasksVar();
      const deletedTask = data.deleteTask.tasks[0];
      //updates state using Reactive Variable with useReactiveHook in Home
      tasksVar(currentTasks.filter((t) => t.id !== deletedTask.id));
    },
  });

  return (
    <Dropdown>
      <Dropdown.Toggle
        as="span"
        id="dropdown-custom-components"
        bsPrefix="p-0"
        style={{ cursor: "pointer" }}
      >
        &#8230;
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() =>
            updateTask({
              variables: {
                updateTaskInput: {
                  id: task.id!,
                  is_finished: !task.is_finished,
                },
              },
            })
          }
        >
          {task.is_finished ? "Mark as incomplete" : "Mark as completed"}
        </Dropdown.Item>
        <ShareModal task={task} />
        <Dropdown.Item
          onClick={() =>
            deleteTask({
              variables: {
                deleteTaskInput: {
                  id: task.id,
                  position: task.position,
                  parent_id: task.parent_id,
                },
              },
            })
          }
        >
          Delete {hasChildren ? "+ Children" : ""}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Options;
