import React from "react";
import { useMutation } from "@apollo/client";
import { v4 as uuid } from "uuid";
import Task from "../types/task";
import { tasksVar, userVar } from "../apollo/reactiveVars";
import {
  DELETE_TASK,
  UPDATE_TASK,
  CREATE_TASK,
  REORDER_TASKS,
} from "../apollo/mutationDefs";
import updateVar from "../utils/updateTaskVar";

interface TaskItemProps {
  tasks: Task[];
  task: Task;
  parentId: string | null;
  hasChildren: boolean;
  nestedOpen?: boolean;
}

let previousText = "previousText";
let lastEditedId = "";
let timeOutVal: any = 0;

const TaskItem: React.FC<TaskItemProps> = (props) => {
  const { task, tasks, parentId, hasChildren, nestedOpen } = props;

  const [createTask] = useMutation(CREATE_TASK);

  const [updateTask] = useMutation(UPDATE_TASK);

  const [reorderTasks] = useMutation(REORDER_TASKS);

  const [deleteTask] = useMutation(DELETE_TASK);

  const handleChange = (e: React.KeyboardEvent<HTMLElement>) => {
    const element = e.target as HTMLElement;
    //This prevents calling the update function everytime a key is pressed. The function is only called when there has been 1000ms time.
    if (e.code === "Backspace" && previousText.length === 0 && !hasChildren) {
      handleDelete(element);
    } else if (e.code === "Enter" || e.code === "NumpadEnter") {
      handleEnter(element);
    } else if (e.shiftKey && e.code === "Tab") {
      handleUnTab();
    } else if (e.code === "Tab") {
      handleTab(element);
    } else if (e.code === "ArrowDown") {
      handleArrowDown(element);
    } else if (e.code === "ArrowUp") {
      handleArrowUp(element);
    } else if (element.innerText !== task.text) {
      handleInputText(element);
    }
  };

  const handleDelete = (el: HTMLElement) => {
    //I don't want to delete the element unless "Backspace" is entered on an empty task, previousText tracks thats.
    previousText = el.innerText;
    deleteTask({
      variables: {
        deleteTaskInput: {
          id: task.id,
          position: task.position,
          parent_id: task.parent_id,
        },
      },
    });
    tasksVar(tasks.filter((t) => t.id !== task.id));
    const priorTask = tasks.filter(
      (t) => t.parent_id === task.parent_id && t.position + 1 === task.position
    )[0];
    if (priorTask) {
      const node = document.getElementById(priorTask.id!);
      if (node) {
        node.focus();
        if (priorTask && priorTask.text.length === 0) {
          node.appendChild(document.createTextNode(""));
        }
        const textNode = node.firstChild!;
        const caret = priorTask.text.length;
        const range = document.createRange();
        range.setStart(textNode, caret);
        range.setEnd(textNode, caret);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const handleEnter = (el: HTMLElement) => {
    //Get's the caret position and splits the text on that position.
    console.log(tasks);
    const index = window.getSelection()?.getRangeAt(0).startOffset;
    const [firstHalfText, secondHalfText] = [
      el.innerText.slice(0, index),
      el.innerText.slice(index),
    ];

    const newTask = {
      id: uuid(),
      text: secondHalfText ? secondHalfText : "",
      owner_id: userVar()?.id!,
      parent_id: hasChildren && nestedOpen ? task.id! : task.parent_id,
      position: hasChildren && nestedOpen ? 0 : task.position + 1,
      is_finished:
        tasks.filter((t) => t.id === parentId).length > 0
          ? tasks.filter((t) => t.id === parentId)[0].is_finished
          : false,
      updated_at: new Date().getTime().toString(),
      created_at: new Date().getTime().toString(),
    };

    tasksVar(
      updateVar({
        key: "enter",
        task,
        secondTask: newTask,
        text: firstHalfText,
      })
    );
    createTask({
      variables: {
        createTaskInput: newTask,
      },
    });
    //updates current task if innerText is split.
    if (secondHalfText.length > 0) {
      updateTask({
        variables: {
          updateTaskInput: {
            id: task.id!,
            text: firstHalfText,
          },
        },
      });
    }

    //set caret to appropriate place
    setTimeout(() => {
      const node = document.getElementById(newTask.id);
      if (node) {
        if (newTask.text.length === 0) {
          node.appendChild(document.createTextNode(""));
        }
        node.focus();
        const textNode = node.firstChild!;
        const caret = newTask.text.length;
        const range = document.createRange();
        range.setStart(textNode, caret);
        range.setEnd(textNode, caret);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 1);
  };

  const handleTab = (el: HTMLElement) => {
    console.log("handleTab fired");
    const newParent = tasks.filter(
      (t) => t.parent_id === task.parent_id && t.position + 1 === task.position
    )[0];
    if (newParent) {
      tasksVar(updateVar({ key: "tab", task, secondTask: newParent }));
      console.log(
        tasksVar()
          .filter((t) => t.parent_id === task.parent_id)
          .map((t) => t.position)
          .sort((a, b) => a - b)
      );
      reorderTasks({
        variables: {
          reorderTasksInput: {
            id: task.id,
            oldPosition: task.position,
            oldParentId: task.parent_id,
            newPosition: 0,
            newParentId: newParent.id,
          },
        },
      });
      updateTask({
        variables: {
          updateTaskInput: {
            id: task.id!,
            parent_id: newParent.id,
            position: 0,
          },
        },
      });
      setTimeout(() => {
        const node = document.getElementById(task.id!);
        if (node) {
          node.focus();
          if (task.text.length === 0) {
            node.appendChild(document.createTextNode(""));
          }
          const textNode = node.firstChild!;
          const caret = task.text.length;
          const range = document.createRange();
          range.setStart(textNode, caret);
          range.setEnd(textNode, caret);
          const sel = window.getSelection()!;
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 5);
    }
  };

  const handleUnTab = () => {
    //finds prior task to nest current task into
    const newPeer = tasks.filter((t) => t.id === task.parent_id)[0];
    if (newPeer) {
      tasksVar(updateVar({ key: "unTab", task, secondTask: newPeer }));
      console.log(
        tasksVar()
          .filter((t) => t.parent_id === task.parent_id)
          .map((t) => t.position)
          .sort((a, b) => a - b)
      );
      reorderTasks({
        variables: {
          reorderTasksInput: {
            id: task.id,
            oldPosition: task.position,
            oldParentId: task.parent_id,
            newPosition: newPeer.position + 1,
            newParentId: newPeer.id,
          },
        },
      });
      updateTask({
        variables: {
          updateTaskInput: {
            id: task.id!,
            position: newPeer.position + 1,
            parent_id: newPeer.parent_id, //set this task's parent_id to the preceding tasks id, thus nesting it.
          },
        },
      });

      setTimeout(() => {
        const node = document.getElementById(task.id!);
        if (node) {
          node.focus();
          if (task.text.length === 0) {
            node.appendChild(document.createTextNode(""));
          }
          const textNode = node.firstChild!;
          const caret = task.text.length;
          const range = document.createRange();
          range.setStart(textNode, caret);
          range.setEnd(textNode, caret);
          const sel = window.getSelection()!;
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 5);
    }
  };

  const handleInputText = (el: HTMLElement) => {
    //the clearTimeout prevents network calls from every key stroke.
    //The lastEditedId check is to ensure that updating a different task doesn't cancel the update of the last edited task
    if (lastEditedId === task.id) {
      clearTimeout(timeOutVal);
    }
    lastEditedId = task.id!;
    console.log("Updating task", el.innerText, task);
    tasksVar(updateVar({ key: "inputText", task, text: el.innerText }));
    timeOutVal = setTimeout(() => {
      updateTask({
        variables: {
          updateTaskInput: {
            id: task.id!,
            text: el.innerText,
          },
        },
      });
    }, 700);
  };

  const handleArrowDown = (el: HTMLElement) => {
    const taskBelow = tasks
      .filter(
        (t) => t.position > task.position && t.parent_id === task.parent_id
      )
      .sort((t1, t2) => t1.position - t2.position)[0];
    const caretedTask = taskBelow !== undefined ? taskBelow : task;
    const node = document.getElementById(caretedTask.id!);
    if (node) {
      node.focus();
      if (caretedTask.text.length === 0) {
        node.appendChild(document.createTextNode(""));
      }
      const textNode = node.firstChild!;
      const caret = caretedTask.text.length;
      const range = document.createRange();
      range.setStart(textNode, caret);
      range.setEnd(textNode, caret);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  const handleArrowUp = (el: HTMLElement) => {
    let taskAbove = tasks
      .filter(
        (t) => t.position < task.position && t.parent_id === task.parent_id
      )
      .sort((t1, t2) => t2.position - t1.position)[0];
    const caretedTask = taskAbove !== undefined ? taskAbove : task;
    const node = document.getElementById(caretedTask.id!);
    if (node) {
      node.focus();
      if (caretedTask.text.length === 0) {
        node.appendChild(document.createTextNode(""));
      }
      const textNode = node.firstChild!;
      const caret = caretedTask.text.length;
      const range = document.createRange();
      range.setStart(textNode, caret);
      range.setEnd(textNode, caret);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  return (
    <p
      style={{
        border: "none",
        outline: "none",
        color: task.is_finished ? "green" : "black",
      }}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onKeyDown={(e) => {
        if (
          e.code === "Enter" ||
          e.code === "Tab" ||
          e.code === "NumpadEnter" ||
          e.code === "ArrowDown"
        ) {
          e.preventDefault();
        } else {
          previousText = (e.target as HTMLElement).innerText;
        }
      }}
      onKeyUp={(e) => handleChange(e)}
      id={task.id}
    >
      {task.text}
    </p>
  );
};

export default TaskItem;
