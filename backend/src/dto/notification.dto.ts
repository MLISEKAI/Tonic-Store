export class NotificationDto {
  id!: string;
  userId!: number;
  message!: string;
  isRead!: boolean;
  link?: string;
  createdAt!: Date;
  updatedAt!: Date;
} 