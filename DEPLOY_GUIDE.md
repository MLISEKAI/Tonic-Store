# Deploy Guide - Vercel + Render

## Tổng quan
| Thành phần | Nền tảng | Root Directory | Build Command | Output |
|---|---|---|---|---|
| Frontend | Vercel | `frontend/` | `yarn build` | `dist/` |
| Admin | Vercel | `admin/` | `yarn build` | `dist/` |
| Backend | Render | `backend/` | `Dockerfile.prod` | `node dist/index.js` |
| Database | Neon PostgreSQL | - | - | - |
| Cache | Render Redis | - | - | - |

---

## 1. Deploy Frontend (Vercel)

### Bước 1: Push code lên GitHub
```bash
cd frontend
git add .
git commit -m "Frontend ready for deploy"
git push origin main
```

### Bước 2: Tạo project trên Vercel
1. Đăng nhập [vercel.com](https://vercel.com) → **New Project**
2. Chọn repo GitHub của bạn (`Tonic-Store`)
3. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
   - **Install Command**: `yarn install`

### Bước 3: Environment Variables (Settings → Environment Variables)
| Name | Value | Mô tả |
|---|---|---|
| `VITE_API_URL` | `https://api.yourdomain.com` | URL backend API |
| `VITE_FRONTEND_URL` | `https://yourdomain.com` | Domain frontend |
| `VITE_ADMIN_URL` | `https://admin.yourdomain.com` | Domain admin |
| `NODE_ENV` | `production` | Môi trường |

### Bước 4: Deploy
- Nhấn **Deploy** → Vercel tự động build & deploy
- Sau khi xong, truy cập domain Vercel cung cấp (`.vercel.app`)

### Bườn 5: Custom Domain (tùy chọn)
1. Vào project → Settings → Domains
2. Thêm domain của bạn (ví dụ: `yourdomain.com`)
3. Cập nhật DNS `CNAME` trỏ về domain Vercel

---

## 2. Deploy Admin (Vercel)

### Bước 1: Tạo project thứ 2 trên Vercel
1. **New Project** → chọn cùng repo
2. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
   - **Install Command**: `yarn install`

### Bước 2: Environment Variables
| Name | Value | Mô tả |
|---|---|---|
| `VITE_API_URL` | `https://api.yourdomain.com` | URL backend API |
| `VITE_ADMIN_URL` | `https://admin.yourdomain.com` | Domain admin |
| `VITE_FRONTEND_URL` | `https://yourdomain.com` | Domain frontend |
| `VITE_BASE_URL` | `/` | Base path (đặt `/` nếu dùng subdomain) |
| `NODE_ENV` | `production` | Môi trường |

### Bước 3: Deploy
- Nhấn **Deploy** → Vercel tự động build & deploy
- Truy cập `admin.vercel.app` hoặc domain custom của bạn

---

## 3. Deploy Backend (Render)

### Bước 1: Database trên Neon (PostgreSQL)
1. Đăng nhập [neon.tech](https://neon.tech) → tạo project mới
2. Tạo database `neondb` (mặc định)
3. Ghi nhớ **Connection String** (dạng `postgresql://USER:PASS@HOST/db?sslmode=require`)

### Bước 2: Tạo Redis trên Render
1. Đăng nhập [render.com](https://render.com) → **New** → **Redis**
2. Đặt tên: `tonic-store-redis`
3. Ghi nhớ **Redis Internal URL** (dạng `redis://...`)

### Bước 3: Tạo Web Service trên Render
1. **New** → **Web Service**
2. Chọn repo GitHub
3. Cấu hình:
   - **Name**: `tonic-store-backend`
   - **Region**: Singapore (gần VN)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile**: `backend/Dockerfile.prod` (hoặc đặt trong render.yaml)
   - **Port**: `8085`

Hoặc dùng `render.yaml` ở thư mục gốc để tự động cấu hình:
```yaml
services:
  - type: web
    name: tonic-store-backend
    runtime: docker
    plan: free
    dockerfilePath: backend/Dockerfile.prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromSecret: DATABASE_URL
      ...
```

### Bước 4: Environment Variables
| Name | Value | Nguồn |
|---|---|---|
| `DATABASE_URL` | Connection string từ Neon | Secret |
| `REDIS_HOST` | Internal Redis host từ bước 2 | Render Redis |
| `REDIS_PORT` | `6379` | - |
| `REDIS_PASSWORD` | (để trống nếu không có) | Render Redis |
| `JWT_SECRET` | `openssl rand -hex 64` | Tự tạo |
| `JWT_REFRESH_SECRET` | `openssl rand -hex 64` | Tự tạo |
| `JWT_EXPIRES_IN` | `1d` | - |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | - |
| `EMAIL_USER` | Email của bạn | - |
| `EMAIL_PASS` | App password | - |
| `VNPAY_TMN_CODE` | Mã từ cổng VNPay | - |
| `VNPAY_SECRET_KEY` | Secret key VNPay | - |
| `VNPAY_HASH_SECRET` | Hash secret VNPay | - |
| `VNPAY_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` | - |
| `VNPAY_RETURN_URL` | `https://yourdomain.com/orders/vnpay/callback` | - |
| `PORT` | `8085` | - |
| `HOST` | `0.0.0.0` | - |
| `NODE_ENV` | `production` | - |
| `FRONTEND_URL` | `https://yourdomain.com` | Vercel domain |
| `VITE_ADMIN_URL` | `https://admin.yourdomain.com` | Vercel domain |

### BưỔc 5: Migrate database
Sau khi deploy xong, vào **Shell** của service:
```bash
cd /app
npx prisma migrate deploy
# Hoặc chạy seed nếu cần
npx prisma db seed
```

### BưỔc 6: Deploy
- Nhấn **Create Web Service**
- Render sẽ tự động build từ `Dockerfile.prod` và deploy
- Backend sẽ có domain dạng `https://tonic-store-backend.onrender.com`

### BưỔc 7: Custom Domain
1. Vào service → Settings → Custom Domains
2. Thêm domain: `api.yourdomain.com`
3. Cập nhật DNS `CNAME` trỏ về domain Render

---

## 4. CI/CD Tự động (GitHub Actions)

Pipeline đã cấu hình trong `.github/workflows/ci.yml`:
- Chạy lint + build tự động trên mỗi PR
- Deploy tự động lên Render/Vercel khi merge vào `main`

---

## 5. Troubleshooting nhanh

| Vấn đề | Giải pháp |
|---|---|
| EMFILE: too many open files | Dùng `Dockerfile.prod` (ko dùng nodemon) |
| Backend không kết nối DB | Kiểm tra `DATABASE_URL` Neon, rà soát SSL |
| CORS error | Cập nhật `FRONTEND_URL` trong backend env |
| API trả về 404 | Kiểm tra `VITE_API_URL` trong frontend env |
| Prisma client lỗi | `Dockerfile.prod` đã có `npx prisma generate` |
| VNPay lỗi callback | Cập nhật `VNPAY_RETURN_URL` bằng domain thật |
