const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;


export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Something went wrong');
  }
  return res.json();
};

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const res = await fetch(API_URL);
    return handleResponse(res);
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await fetch(`${API_URL}/${id}`);
    return handleResponse(res);
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteUser: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete user');
    }
  },
};
