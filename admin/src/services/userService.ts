const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
  address?: string;
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
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  getUserById: async (id: number): Promise<User> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteUser: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete user');
    }
  },
};
