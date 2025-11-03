# Tonic Store

**Tonic Store** là một nền tảng thương mại điện tử hiện đại, được xây dựng với **React**, **Node.js**, **Prisma**, và **Docker**.  
Dự án cung cấp đầy đủ các tính năng như quản lý sản phẩm, giỏ hàng, đơn hàng, bảng điều khiển quản trị và giao diện responsive thân thiện với người dùng.

---

## Live Demo
🔗 [https://loctt.duckdns.org/](https://loctt.duckdns.org/)

---

## Bắt đầu

### Sao chép và cài đặt
```bash
git clone https://github.com/MLISEKAI/tonic-store.git
cd tonic-store


## Cài đặt dependencies
cd frontend && yarn install
cd ../backend && yarn install
cd ../admin && yarn install

## Thiết lập biến môi trường
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp admin/.env.example admin/.env

## Khởi động dự án

Chạy bằng Docker:

docker-compose up -d


Hoặc chạy thủ công:

cd backend && yarn dev
cd frontend && yarn dev
cd admin && yarn dev

## Tính năng chính

Xác thực & phân quyền người dùng

Quản lý sản phẩm, giỏ hàng, đơn hàng

Bảng điều khiển quản trị (Admin Dashboard)

Giao diện đáp ứng (Responsive Design)

## Tech Stack
Thành phần	Công nghệ sử dụng
Frontend	React, TypeScript, Vite, Tailwind CSS, React Query
Backend	Node.js, Express, Prisma, PostgreSQL, JWT
Admin Panel	React + TypeScript
DevOps	Docker, Docker Compose, GitHub Actions (CI/CD)

## Cấu trúc thư mục
tonic-store/
├── frontend/       # Ứng dụng khách hàng
├── backend/        # API server (Express + Prisma)
├── admin/          # Trang quản trị
└── docker/         # Cấu hình Docker

## Tác giả

Tran Thanh Loc

Cảm ơn cộng đồng mã nguồn mở 