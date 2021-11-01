import React, { useState } from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import { Collapse, Container } from "react-bootstrap";
import Task from "../types/task";
import Options from "./Options";
import { useHistory } from "react-router";
import { tasksVar } from "../apollo/reactiveVars";
import { CREATE_TASK } from "../apollo/mutationDefs";
import TaskItem from "./TaskItem";

interface TasksProps {
  parentId: string | null;
  insideTask?: boolean;
}

const highestLevelTasks = (taskArr: Task[], parentId: string | null) => {
  if (parentId === null) {
    const taskIds: (string | null)[] = taskArr.map((t) => t.id!);
    return taskArr
      .filter((t) => !taskIds.includes(t.parent_id))
      .sort((t1, t2) => t1.position - t2.position);
  } else {
    return taskArr
      .filter((t) => t.parent_id === parentId)
      .sort((t1, t2) => t1.position - t2.position);
  }
};

const Tasks: React.FC<TasksProps> = (props: TasksProps) => {
  const history = useHistory();
  const { parentId, insideTask } = props;
  const tasks = useReactiveVar(tasksVar);
  const topLevelTasks = highestLevelTasks(tasks, parentId);
  const [isOpen, setIsOpen] = useState<boolean[]>(
    highestLevelTasks(tasks, parentId).map((_) => false)
  );

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted(data) {
      const currentTasks = tasksVar();
      const createdTask = data.createTask.tasks[0];
      //updates state using Reactive Variable with useReactiveHook in Home
      tasksVar([...currentTasks, createdTask]);
      setTimeout(() => {
        const node = document.getElementById(createdTask.id);
        if (node) {
          node.appendChild(document.createTextNode(""));
          node.focus();
          const textNode = node.firstChild!;
          const caret = createdTask.text.length;
          const range = document.createRange();
          range.setStart(textNode, caret);
          range.setEnd(textNode, caret);
          const sel = window.getSelection()!;
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 10);
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <Container style={{ width: "60vw" }}>
      {insideTask ? (
        <h3>{tasks.filter((t) => t.id === parentId)[0].text}</h3>
      ) : (
        <></>
      )}

      {topLevelTasks.length > 0 ? (
        topLevelTasks.map((topLevelTask, i) => {
          const taskHasChildren = tasks.some(
            (t) => t.parent_id === topLevelTask.id
          );
          return (
            <div key={topLevelTask.id}>
              {taskHasChildren ? (
                <>
                  <div
                    style={{
                      display: "inline-grid",
                      gridTemplateColumns: "repeat(24, 1fr)",
                      gridTemplateRows: "1",
                      width: "100%",
                    }}
                  >
                    <div style={{ gridColumn: "1/2" }}>
                      <Options task={topLevelTask} hasChildren={true} />
                    </div>
                    <div style={{ gridColumn: "2/3" }}>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          console.log(isOpen.length);
                          setIsOpen(
                            isOpen.map((bool, j) => (j === i ? !bool : bool))
                          );
                        }}
                      >
                        {isOpen[i] ? <>&#x25BC;</> : <>&#x25BA;</>}
                      </span>
                    </div>
                    <div
                      style={{ gridColumn: "3/4", cursor: "pointer" }}
                      onClick={() => history.push(`/task/${topLevelTask.id}`)}
                    >
                      &#9679;
                    </div>

                    <div style={{ gridColumn: "4/24" }}>
                      <TaskItem
                        task={topLevelTask}
                        tasks={tasks}
                        parentId={parentId}
                        hasChildren={true}
                        nestedOpen={isOpen[i]}
                      />
                    </div>
                  </div>
                  <Collapse in={isOpen[i]} timeout={100}>
                    <div style={{ margin: "0 1em" }} id="example-collapse-text">
                      <Tasks parentId={topLevelTask.id!} />
                    </div>
                  </Collapse>
                </>
              ) : (
                <div
                  style={{
                    display: "inline-grid",
                    gridTemplateColumns: "repeat(24, 1fr)",
                    gridTemplateRows: "1",
                    width: "100%",
                  }}
                >
                  <div style={{ gridColumn: "1/2" }}>
                    <Options task={topLevelTask} hasChildren={false} />
                  </div>
                  <div
                    style={{ gridColumn: "3/4", cursor: "pointer" }}
                    onClick={() => history.push(`/task/${topLevelTask.id}`)}
                  >
                    &#9679;
                  </div>
                  <div style={{ gridColumn: "4/24" }}>
                    <TaskItem
                      task={topLevelTask}
                      tasks={tasks}
                      parentId={parentId}
                      hasChildren={false}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p
          style={{ cursor: "pointer" }}
          onClick={() => {
            createTask({
              variables: {
                createTaskInput: {
                  text: "",
                  parent_id: parentId,
                  position: 0,
                },
              },
            });
          }}
        >
          +
        </p>
      )}
    </Container>
  );
};

export default Tasks;
