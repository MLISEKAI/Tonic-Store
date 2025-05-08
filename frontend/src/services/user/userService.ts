import { API_URL } from '../api';

export const UserService = {
  // Đăng ký tài khoản
  async register(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to register');
    return response.json();
  },

  // Đăng nhập
  async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
  },

  // Lấy thông tin hồ sơ
  async getProfile() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // Cập nhật thông tin hồ sơ
  async updateProfile(data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Đổi mật khẩu
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to change password');
    return response.json();
  },

  // Quên mật khẩu
  async forgotPassword(email: string) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to send reset password email');
    return response.json();
  },

  // Đặt lại mật khẩu
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to reset password');
    return response.json();
  },

  // Gửi email xác thực
  async sendVerificationEmail() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/send-verification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to send verification email');
    return response.json();
  },

  // Xác thực email
  async verifyEmail(token: string) {
    const response = await fetch(`${API_URL}/users/verify-email/${token}`);
    if (!response.ok) throw new Error('Failed to verify email');
    return response.json();
  }
}; 