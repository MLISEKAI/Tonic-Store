import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { NotificationService } from '../services/notification/notificationService';

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await NotificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông báo',
          placement: 'topRight',
          duration: 2,
        });
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Thông báo</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        {notifications.length === 0 ? (
          <p>Hiện tại bạn không có thông báo nào.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="mb-2">
                <div className="font-medium">{notification.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;