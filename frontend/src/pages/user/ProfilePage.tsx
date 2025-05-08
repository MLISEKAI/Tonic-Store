import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin, notification } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, UpdateUserProfileData } from '../../types/user';
import ProfileForm from '../../components/user/ProfileForm';
import { UserService } from '../../services/user/userService';

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
      const data = await UserService.getProfile();
      setProfile(data);
    } catch (error) {
      message.error('Không thể tải thông tin hồ sơ');
    }
  };

  const onFinish = async (values: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    try {
      await UserService.updateProfile(values);
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật thông tin thành công',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Cập nhật thông tin thất bại',
        placement: 'topRight',
        duration: 2,
      });
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
            onSubmit={onFinish}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 