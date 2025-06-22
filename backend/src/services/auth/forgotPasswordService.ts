import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Kiểm tra các biến môi trường cần thiết
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET chưa được cấu hình trong .env");
}

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL chưa được cấu hình trong .env");
}

if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình trong .env");
  }

export async function sendResetPasswordEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Email không tồn tại trong hệ thống');

  const token = jwt.sign({ userId: user.id }, SECRET_KEY as string, { expiresIn: '15m' });
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
        },
    });

  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Khôi phục mật khẩu Tonic Store',
    html: `
      <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào link dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link này sẽ hết hạn sau 15 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `
  }).catch(err => {
    console.error('Gửi email thất bại:', err);
    throw new Error('Không thể gửi email khôi phục');
  });
}

export async function resetPasswordByToken(token: string, newPassword: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY as string);
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại link đặt lại mật khẩu.');
    }
    const payload = decoded as { userId: number };
    
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new Error('Người dùng không tồn tại');

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return true;
  } catch (err) {
    console.error('Lỗi reset password:', err);
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
}
