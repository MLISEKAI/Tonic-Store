export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileData {
  name?: string;
  phone?: string;
  address?: string;
} 