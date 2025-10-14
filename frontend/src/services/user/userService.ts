import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const UserService = {
  // Đăng xuất
  async logout() {
    try {
      const response = await fetchWithCredentials(ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
  // Đăng ký tài khoản
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) {
    try {
      const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role: 'CUSTOMER'
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Xử lý các trường hợp lỗi cụ thể
        if (response.status === 400 && responseData.error === "Email already exists") {
          throw new Error("Email này đã được sử dụng. Vui lòng sử dụng email khác.");
        }
        
        // Xử lý lỗi server
        if (response.status === 500) {
          console.error("Server error details:", responseData);
          throw new Error("Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.");
        }

        throw new Error(responseData.error || responseData.message || 'Đăng ký thất bại');
      }

      return responseData;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Đăng nhập
  async login(credentials: { email: string; password: string }) {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email và mật khẩu không được để trống');
      }

      const response = await fetchWithCredentials(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email.toLowerCase().trim(),
          password: credentials.password
        }),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đăng nhập thất bại');
    }
  },

  // Lấy thông tin hồ sơ
  async getProfile() {
    try {
      const response = await fetchWithCredentials(ENDPOINTS.USER.PROFILE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // Cập nhật thông tin hồ sơ
  async updateProfile(data: {
    fullName?: string;
    phone?: string;
    address?: string;
  }) {
    const response = await fetchWithCredentials(ENDPOINTS.USER.PROFILE, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Đổi mật khẩu
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const response = await fetchWithCredentials(ENDPOINTS.USER.CHANGE_PASSWORD, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Quên mật khẩu
  async forgotPassword(email: string) {
    const response = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Đặt lại mật khẩu
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }) {
    const response = await fetch(ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Gửi email xác thực
  async sendVerificationEmail() {
    const response = await fetchWithCredentials(ENDPOINTS.USER.SEND_VERIFICATION, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Xác thực email
  async verifyEmail(token: string) {
    const response = await fetchWithCredentials(ENDPOINTS.USER.VERIFY_EMAIL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};