import { fetchWithCredentials, getHeaders } from './api';
import { User, CreateUserData, UpdateUserData } from '../types/user';

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;
const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Xử lý phản hồi từ API
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Something went wrong');
  }
  return res.json();
};

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const res = await fetchWithCredentials(API_URL, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  login: async (email: string, password: string) => {
    const res = await fetchWithCredentials(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  logout: async () => {
    const res = await fetchWithCredentials(`${AUTH_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await fetchWithCredentials(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getProfile: async (): Promise<User> => {
    const res = await fetchWithCredentials(`${API_URL}/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const res = await fetchWithCredentials(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        address: data.address,
      }),
    });
    return handleResponse(res);
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const res = await fetchWithCredentials(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteUser: async (id: number): Promise<void> => {
    const res = await fetchWithCredentials(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete user');
    }
  },

  changeUserPassword: async (userId: number, newPassword: string): Promise<void> => {
    const res = await fetchWithCredentials(`${API_URL}/${userId}/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newPassword }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to change password');
    }
  },
};
