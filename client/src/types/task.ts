interface Task {
  text: string;
  parent_id: string | null;
  position: number;
  is_finished: boolean;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  id?: string;
  children?: Task[];
}

export default Task;
