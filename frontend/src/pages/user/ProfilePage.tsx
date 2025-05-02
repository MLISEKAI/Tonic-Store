import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import * as userApi from '../../services/user/api';
import { UserProfile, UpdateUserProfileData } from '../../types/user';
import ProfileForm from '../../components/user/ProfileForm';

const ProfilePage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const data = await userApi.getUserProfile(token!);
      setProfile(data);
    } catch (error) {
      message.error('Không thể tải thông tin hồ sơ');
    }
  };

  const handleSubmit = async (values: UpdateUserProfileData) => {
    try {
      setLoading(true);
      await userApi.updateUserProfile(token!, values);
      message.success('Cập nhật hồ sơ thành công');
      fetchProfile();
    } catch (error) {
      message.error('Cập nhật hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Hồ sơ của tôi</h1>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <ProfileForm
            initialValues={profile}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 