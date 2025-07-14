import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { UserRepository } from '../repositories';

type UserRole = 'ADMIN' | 'CUSTOMER';

const userRepository = new UserRepository();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình trong .env");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
    },
});

async function sendPasswordChangeNotification(userEmail: string, userName: string, newPassword_PlainText: string) {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
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
  return userRepository.findUsersWithSelect(userSelectFields);
};

export const deleteUser = async (id: number) => {
  await userRepository.delete(id);
};

export const getUserProfile = async (userId: number) => {
  return userRepository.findUserByIdWithSelect(userId, userSelectFields);
};

export const updateUserProfile = async (userId: number, data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  return userRepository.updateUserWithSelect(userId, data, userSelectFields);
};

export const changeUserPassword = async (userId: number, adminId: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const [updatedUser] = await userRepository.updateUserPasswordWithLog(
    userId, 
    adminId, 
    hashedPassword, 
    userSelectFields
  );

  // Gửi email thông báo sau khi mật khẩu đã được thay đổi thành công
  if (updatedUser) {
    await sendPasswordChangeNotification(updatedUser.email, updatedUser.name, 'Your password has been changed successfully.');
  }

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
  return userRepository.updateUserWithSelect(userId, { password: hashedPassword }, userSelectFields);
};

export const updateUser = async (id: number, data: {
  name?: string;
  email?: string;
  role?: UserRole;
  phone?: string;
  address?: string;
}) => {
  return userRepository.updateUserWithSelect(id, {
    name: data.name,
    email: data.email,
    role: data.role ? data.role : undefined,
    phone: data.phone,
    address: data.address,
  }, userSelectFields);
};
