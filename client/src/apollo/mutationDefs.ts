import { gql } from "@apollo/client";

const CREATE_TASK = gql`
  mutation createTask($createTaskInput: TaskInput!) {
    createTask(task: $createTaskInput) {
      message
      success
      tasks {
        id
        text
        parent_id
        position
        owner_id
        is_finished
        updated_at
        created_at
      }
      updatedPeerTasks {
        id
        text
        parent_id
        position
        owner_id
        is_finished
        updated_at
        created_at
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation updateTask($updateTaskInput: TaskInput) {
    updateTask(task: $updateTaskInput) {
      message
      success
      tasks {
        id
        text
        parent_id
        position
        owner_id
        is_finished
        updated_at
        created_at
      }
      updatedPeerTasks {
        id
        text
        parent_id
        position
        owner_id
        is_finished
        updated_at
        created_at
      }
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTask($deleteTaskInput: TaskInput) {
    deleteTask(task: $deleteTaskInput) {
      message
      success
      tasks {
        id
      }
      updatedPeerTasks {
        id
        text
        parent_id
        position
        owner_id
        is_finished
        updated_at
        created_at
      }
    }
  }
`;

const SHARE_TASK = gql`
  mutation shareTask($email: String!, $task_id: String!) {
    shareTask(email: $email, task_id: $task_id) {
      success
      message
      tasks {
        id
      }
    }
  }
`;

const REORDER_TASKS = gql`
  mutation reorderTasks($reorderTasksInput: ReorderTasksInput!) {
    reorderTasks(reorderTasksInput: $reorderTasksInput) {
      success
      message
      tasks {
        id
        position
      }
      updatedPeerTasks {
        id
      }
    }
  }
`;

export { UPDATE_TASK, DELETE_TASK, CREATE_TASK, SHARE_TASK, REORDER_TASKS };
