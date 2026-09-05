import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { UserRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';
import { QueueService } from './queue.service';
import logger from '../config/logger';

const userRepository = new UserRepository();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_ENABLED = Boolean(EMAIL_USER && EMAIL_PASS);

let transporter: nodemailer.Transporter | null = null;
if (EMAIL_ENABLED) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER as string,
        pass: EMAIL_PASS as string,
      },
    });
  } catch (err) {
    logger.warn('Failed to create nodemailer transporter', { err: err instanceof Error ? err.message : String(err) });
  }
}

async function sendPasswordChangeNotification(userEmail: string, userName: string, newPassword_PlainText: string) {
  try {
    if (!EMAIL_ENABLED || !transporter) {
      logger.warn('Email not configured. Queuing notification for retry.');
      void QueueService.addEmailJob({
        to: userEmail,
        subject: 'Thông báo thay đổi mật khẩu tài khoản Tonic Store',
        html: `
          <p>Xin chào ${userName},</p>
          <p>Mật khẩu của bạn tại Tonic Store vừa được thay đổi.</p>
          <p>Mật khẩu mới: <strong>${newPassword_PlainText}</strong></p>
          <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay lập tức.</p>
          <p>Trân trọng,<br>Đội ngũ Tonic Store</p>
        `,
      });
      return;
    }
    await transporter.sendMail({
      from: EMAIL_USER as string,
      to: userEmail,
      subject: 'Thông báo thay đổi mật khẩu tài khoản Tonic Store',
      html: `
        <p>Xin chào ${userName},</p>
        <p>Chúng tôi thông báo rằng mật khẩu cho tài khoản của bạn tại <strong>Tonic Store</strong> vừa được một Quản trị viên thay đổi.</p>
        <p>Mật khẩu tạm thời của bạn là: <strong style="font-size: 16px; color: #d9534f;">${newPassword_PlainText}</strong></p>
        <p><strong>QUAN TRỌNG:</strong> Vì lý do bảo mật, vui lòng đăng nhập ngay lập tức bằng mật khẩu tạm thời này và đổi sang một mật khẩu mới mà chỉ bạn biết.</p>
        <p>Nếu bạn không yêu cầu sự thay đổi này, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi ngay lập tức để bảo vệ tài khoản của bạn.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ Tonic Store</p>
      `
    });
  } catch (error) {
    console.error(`Không thể gửi email thông báo đổi mật khẩu tới ${userEmail}:`, error);
    void QueueService.addEmailJob({
      to: userEmail,
      subject: 'Thông báo thay đổi mật khẩu tài khoản Tonic Store',
      html: `
        <p>Xin chào ${userName},</p>
        <p>Mật khẩu của bạn tại Tonic Store vừa được thay đổi.</p>
        <p>Mật khẩu mới: <strong>${newPassword_PlainText}</strong></p>
        <p>Trân trọng,<br>Đội ngũ Tonic Store</p>
      `,
    });
  }
}

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  address: true,
  createdAt: true,
};

export const getAllUsers = async () => {
  const cached = await CacheService.get(CacheKeys.USER_LIST());
  if (cached) return cached;

  const users = await userRepository.findUsersWithSelect(userSelectFields);
  await CacheService.set(CacheKeys.USER_LIST(), users, 300);
  return users;
};

export const deleteUser = async (id: number, force: boolean = false, deletedBy?: number) => {
  let result;
  if (force && deletedBy) {
    result = await userRepository.forceDelete(id, deletedBy);
  } else {
    const { hasRelated, relatedTypes } = await userRepository.checkRelatedRecords(id);
    if (hasRelated) {
      throw new Error(
        `Không thể xóa người dùng này vì đang có dữ liệu liên quan: ${relatedTypes.join(', ')}. ` +
        `Vui lòng xóa hoặc chuyển đổi các dữ liệu liên quan trước khi xóa người dùng.`
      );
    }
    result = await userRepository.delete(id);
  }

  await CacheService.delete(CacheKeys.USER_LIST());
  await CacheService.delete(CacheKeys.USER_PROFILE(id));
  return result;
};

export const getUserProfile = async (userId: number) => {
  const cacheKey = CacheKeys.USER_PROFILE(userId);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const user = await userRepository.findUserByIdWithSelect(userId, userSelectFields);
  if (user) {
    await CacheService.set(cacheKey, user, 600);
  }
  return user;
};

export const updateUserProfile = async (userId: number, data) => {
  const user = await userRepository.updateUserWithSelect(userId, data, userSelectFields);
  await CacheService.delete(CacheKeys.USER_PROFILE(userId));
  await CacheService.delete(CacheKeys.USER_LIST());
  return user;
};

export const changeUserPassword = async (userId: number, adminId: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [updatedUser] = await userRepository.updateUserPasswordWithLog(
    userId,
    adminId,
    hashedPassword,
    userSelectFields
  );

  if (updatedUser) {
    const userEmail = updatedUser.email;
    const userName = updatedUser.name;
    if (EMAIL_ENABLED && transporter) {
      await sendPasswordChangeNotification(userEmail, userName, 'Your password has been changed successfully.');
    } else {
      void QueueService.addEmailJob({
        to: userEmail,
        subject: 'Thông báo thay đổi mật khẩu tài khoản Tonic Store',
        html: `
          <p>Xin chào ${userName},</p>
          <p>Mật khẩu của bạn vừa được thay đổi bởi quản trị viên.</p>
          <p>Vui lòng đăng nhập và đổi mật khẩu ngay lập tức.</p>
          <p>Trân trọng,<br>Đội ngũ Tonic Store</p>
        `,
      });
    }
  }

  await CacheService.delete(CacheKeys.USER_PROFILE(userId));
  return updatedUser;
};

export const changeOwnPassword = async (userId: number, currentPassword: string, newPassword: string) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await userRepository.updateUserWithSelect(userId, { password: hashedPassword }, userSelectFields);
  await CacheService.delete(CacheKeys.USER_PROFILE(userId));
  return result;
};

export const updateUser = async (id: number, data) => {
  const user = await userRepository.updateUserWithSelect(id, {
    name: data.name,
    email: data.email,
    role: data.role ? data.role : undefined,
    phone: data.phone,
    address: data.address,
  }, userSelectFields);

  await CacheService.delete(CacheKeys.USER_PROFILE(id));
  await CacheService.delete(CacheKeys.USER_LIST());
  return user;
};
