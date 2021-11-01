interface User {
  email: string;
  first_name: string;
  last_name: string;
  token?: string | null;
  created_at?: string;
  updated_at?: string;
  id?: string | null;
}

export default User;
