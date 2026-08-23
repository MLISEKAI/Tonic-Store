# 📚 TONIC STORE — TÀI LIỆU DỰ ÁN TOÀN DIỆN

> **Tonic Store** là nền tảng thương mại điện tử gồm 3 ứng dụng: **Frontend** (khách hàng), **Backend** (REST API), **Admin** (trang quản trị), được đóng gói và triển khai bằng **Docker**.
>
> - 🌐 Live demo: [https://loctt.duckdns.org/](https://loctt.duckdns.org/)
> - 👤 Tác giả: Tran Thanh Loc — License: MIT

---

## MỤC LỤC

1. [Tổng quan & Tech Stack](#1-tổng-quan--tech-stack)
2. [Cấu trúc thư mục tổng thể](#2-cấu-trúc-thư-mục-tổng-thể)
3. [Backend — Kiến trúc & Cấu trúc](#3-backend--kiến-trúc--cấu-trúc)
4. [Backend — Cơ sở dữ liệu (Prisma)](#4-backend--cơ-sở-dữ-liệu-prisma)
5. [Backend — Danh sách toàn bộ API](#5-backend--danh-sách-toàn-bộ-api)
6. [Backend — Xác thực, phân quyền & bảo mật](#6-backend--xác-thực-phân-quyền--bảo-mật)
7. [Frontend — Ứng dụng khách hàng](#7-frontend--ứng-dụng-khách-hàng)
8. [Admin — Trang quản trị](#8-admin--trang-quản-trị)
9. [Docker & Hạ tầng](#9-docker--hạ-tầng)
10. [CI/CD (GitHub Actions)](#10-cicd-github-actions)
11. [Biến môi trường](#11-biến-môi-trường)
12. [Hướng dẫn cài đặt & chạy dự án](#12-hướng-dẫn-cài-đặt--chạy-dự-án)

---

## 1. Tổng quan & Tech Stack

| Thành phần | Công nghệ |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Ant Design, React Router v7, Zustand, React Hot Toast, qrcode |
| **Backend** | Node.js, Express 5, TypeScript, Prisma ORM, MySQL 8.0, JWT, Redis (cache/pub-sub), Nodemailer |
| **Admin Panel** | React 19, TypeScript, Vite, Ant Design, Recharts, React Router v7 |
| **Database** | MySQL 8.0 (utf8mb4) + Prisma Migrations |
| **Cache / MQ** | Redis 7 (ioredis — cache + pub/sub) |
| **DevOps** | Docker, Docker Compose (dev + prod), Nginx reverse proxy, Certbot SSL, GitHub Actions CI/CD |
| **Monitoring** | Winston logger, Morgan, Swagger UI |
| **Thanh toán** | VNPay (sandbox), COD, Bank Transfer |

---

## 2. Cấu trúc thư mục tổng thể

```
tonic-store/
├── admin/                     # Trang quản trị (React + Vite, port 3001)
├── backend/                   # REST API server (Express + Prisma, port 8085)
│   ├── prisma/
│   │   ├── schema.prisma      # Định nghĩa toàn bộ model DB
│   │   ├── seed.ts            # Dữ liệu mẫu
│   │   └── migrations/        # 23 migration files
│   ├── src/
│   │   ├── common/            # Exception, error-code, types, validation
│   │   ├── config/            # Env config, logger, swagger
│   │   ├── controllers/       # Xử lý request/response
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── middleware/        # auth (JWT)
│   │   ├── repositories/      # Repository pattern + interfaces
│   │   ├── routes/            # Định tuyến Express
│   │   ├── services/          # Business logic (+ auth/, Redis)
│   │   ├── utils/
│   │   ├── app.ts             # App rút gọn (test)
│   │   ├── index.ts           # ✅ ENTRY POINT chính
│   │   └── prisma.ts          # Prisma client instance
│   └── package.json
├── frontend/                  # Web khách hàng (React + Vite, port 5173)
│   ├── src/
│   │   ├── assets/icons/      # SVG icon components (VNPay, Visa, Zalo...)
│   │   ├── components/        # checkout, flash-sale, home, layout, payment,
│   │   │                      # product, shipper, user
│   │   ├── constants/         # paymentIcons, socialIcons
│   │   ├── contexts/          # AuthContext, CartContext, WishlistContext
│   │   ├── hooks/             # Custom hooks (useProducts, useSearch...)
│   │   ├── layouts/           # AuthLayout, ShipperLayout
│   │   ├── pages/             # ~50 trang (theo thư mục chức năng)
│   │   ├── services/          # Gọi API backend (fetch + credentials)
│   │   ├── types/
│   │   └── utils/             # format, dateUtils, vnpay-init/timer...
│   └── package.json
├── docker/
│   ├── db/data                # Volume dữ liệu MySQL (dev)
│   ├── db/init                # Script khởi tạo DB
│   ├── nginx/conf.d           # Cấu hình reverse proxy production
├── .github/workflows/ci.yml   # Pipeline CI/CD
├── docker-compose.yml         # Môi trường DEV
├── docker-compose.prod.yml    # Môi trường PRODUCTION
└── README.md
```

---

## 3. Backend — Kiến trúc & Cấu trúc

### 3.1. Kiến trúc phân lớp

```
Request → Route (routes/) → Middleware xác thực → Controller (controllers/)
        → Service (services/) → Repository (repositories/) → Prisma → MySQL
```

- **Repository Pattern**: mỗi repository có interface riêng trong `repositories/interfaces/` (`IBaseRepository`, `IUserRepository`, `IProductRepository`, `IOrderRepository`...) giúp tách biệt logic truy xuất dữ liệu khỏi business logic, dễ test/maintain. Chi tiết: `backend/src/repositories/README.md`.
- **DTO**: `backend/src/dto/` chứa các DTO cho cart, category, discount-code, notification, order, payment, product, review, shipping-address, user, wishlist, delivery-log/rating.
- **Common**: 
  - `common/exceptions/error-codes.ts` — enum mã lỗi chuẩn hóa (VD: `RESOURCE_NOT_FOUND = 400201`, `INVALID_ACCESS_TOKEN = 401302`, `RATE_LIMIT_EXCEEDED = 500910`...)
  - `common/exceptions/system-exception.ts`, `common/middleware/error-handler.ts`
  - `common/types/api-response.ts`, `pagination.ts`, `common/validation.ts`, `string-utils.ts`

### 3.2. Entry point — `src/index.ts`

Server Express chính (mặc định chạy tại `PORT=8085`, `HOST=0.0.0.0`) với các middleware:

| Middleware | Mục đích |
|---|---|
| `helmet()` | Bảo mật HTTP headers |
| `cors` | Cho phép origin `localhost:5173` (FE) & `localhost:3001` (admin); dev cho phép mọi localhost; `credentials: true` để gửi cookie |
| `compression()` | Nén response gzip |
| `express.json()`, `cookieParser()` | Parse JSON body & cookie |
| `morgan('combined') → winston` | HTTP request logging |
| Rate limiter | Có sẵn nhưng đang bị comment out |

Các endpoint hệ thống:

| Endpoint | Mô tả |
|---|---|
| `GET /api/docs` | Swagger UI (tự sinh từ `config/swagger.ts` bằng swagger-jsdoc) |
| `GET /health` | Health check `{ status: 'ok' }` |
| `GET /test` | Endpoint kiểm tra server đang chạy |

Xử lý sự kiện tiến trình: `unhandledRejection`, `uncaughtException`. Khởi động Redis cache tùy chọn qua `connectRedis()` (server vẫn chạy nếu Redis không khả dụng).

> ⚠️ `src/app.ts` là bản app rút gọn dùng cho test (thiếu một số route như payments, reviews, wishlist, notifications). **Bản chạy thật là `index.ts`.**

### 3.3. Config — `src/config/index.ts`

```ts
{
  vnpay:    { tmnCode, secretKey, url, returnUrl },       // từ env VNPAY_*
  jwt:      { secret, expiresIn: '1d', refreshSecret,
              refreshExpiresIn: '7d', cookieOptions,
              refreshCookieOptions, blacklistEnabled, blacklistTTL },
  database: { url }                                       // DATABASE_URL
}
```
- Cookie JWT: `httpOnly`, `secure` khi prod, `sameSite: strict` (prod) / `lax` (dev).
- Logger: `config/logger.ts` (Winston).

---

## 4. Backend — Cơ sở dữ liệu (Prisma)

- Provider: **MySQL**, client: `prisma-client-js` (binaryTargets: native + debian-openssl-3.0.x cho Docker).
- Client instance: `src/prisma.ts`. Seed data: `prisma/seed.ts` (script `yarn seed`).

### 4.1. Các Model (18 bảng)

#### `User` — người dùng
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | Int PK autoincrement | |
| name, email (unique), password | String | bcrypt hash |
| role | Role | CUSTOMER / ADMIN / DELIVERY |
| phone, address | String? | |
| deletedAt, deletedBy | DateTime?/Int? | Soft delete |
| Quan hệ | | cart, orders, reviews, shippingAddresses, wishlist, notifications, deliveryLogs/Ratings, discountCodeUsages/Claims, blacklistedTokens, refreshTokens, passwordChanges... |

#### `Category` — danh mục
`id, name (unique), createdAt, updatedAt` ↔ `products[]`

#### `Product` — sản phẩm
- Cơ bản: `name(255), description(Text), price Decimal(10,2), promotionalPrice?, stock, imageUrl?, categoryId → Category`
- Thương mại: `sku?, barcode?, weight?, dimensions?, material?, origin?, warranty?, status ProductStatus (default ACTIVE)`
- SEO: `seoTitle?(70), seoDescription?(320), seoUrl? (unique)`
- Cờ/thống kê: `isFeatured, isNew, isBestSeller, rating, reviewCount, viewCount, soldCount`
- Quan hệ: cartItems, orderItems, reviews, wishlist. Index: categoryId, sku, barcode.

#### `Cart` / `CartItem` — giỏ hàng
- Cart: `userId (unique) → User`, items[]
- CartItem: `cartId → Cart`, `productId → Product`, `quantity (default 1)`, `price Float`

#### `Order` / `OrderItem` — đơn hàng
- Order: `userId → User`, `totalPrice`, `status OrderStatus (PENDING)`, `shippingAddress/Phone/Name`, `note?`, `shipperId? → User ("ShipperOrders")`, `promotionCode?`, `discount?`
- OrderItem: `orderId → Order`, `productId → Product`, `quantity`, `price`

#### `Payment` — thanh toán
`orderId (unique) → Order`, `method PaymentMethod`, `status PaymentStatus (PENDING)`, `amount`, `currency "VND"`, `transactionId?`, `paymentDate?`

#### Các model khác
| Model | Ý nghĩa | Trường chính |
|---|---|---|
| `PasswordChangeLog` | Log đổi mật khẩu (user/admin thực hiện) | userId, adminId, changedAt |
| `Review` | Đánh giá sản phẩm | userId+productId (**unique**), rating, comment |
| `ShippingAddress` | Sổ địa chỉ giao hàng | name, phone, address, isDefault |
| `DeliveryLog` | Log quá trình giao hàng | orderId, deliveryId, status OrderStatus, note |
| `Wishlist` | Sản phẩm yêu thích | userId+productId (**unique**) |
| `Notification` | Thông báo (id UUID) | message, isRead, link? |
| `DeliveryRating` | Đánh giá shipper | orderId (**unique**), rating, comment |
| `DiscountCode` (@map `discount_codes`) | Mã giảm giá | code (unique), discountType, discountValue, minOrderValue?, maxDiscount?, startDate, endDate, usageLimit?, usedCount, isActive |
| `DiscountCodeUsage` | Lượt sử dụng mã | userId+discountCodeId unique, orderId? |
| `DiscountCodeClaim` | Người dùng "lưu" mã | userId+discountCodeId unique, isUsed |
| `TokenBlacklist` | JWT access token đã logout | token (unique, hash VarChar 500), expiresAt |
| `RefreshToken` | Refresh token theo thiết bị | token (unique), deviceInfo?, expiresAt, revoked |

### 4.2. Enums

```prisma
Role            { CUSTOMER, ADMIN, DELIVERY }
OrderStatus     { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED }
PaymentStatus   { PENDING, COMPLETED, FAILED, REFUNDED, PARTIALLY_REFUNDED }
PaymentMethod   { CREDIT_CARD, PAYPAL, VN_PAY, COD, BANK_TRANSFER }
ProductStatus   { ACTIVE, INACTIVE, OUT_OF_STOCK, COMING_SOON }
DiscountType    { PERCENTAGE, FIXED_AMOUNT }
```

### 4.3. Migration history (23 migrations)

`init` (2025-04-02) → `init` (04-12) → `ondelete_cascade` → `add_password_change_log` → `remove_updatedat_from_order` → `add_category_table` → `add_category_relation` → `update_product_seo_url` → `add_shipping_address` → `add_delivery_role_and_logs` → `add_wishlist` → `add_promotional_price` → `add_notification` → `add_delivery_rating` → `add_discount_codes` → `add_promotion_to_order` → `add_discount_code_usage` → `add_discount_code_claim` → `add_price_to_cart_item` → `update_schema_blacklisted_tokens` → `add_refresh_token_table` → `add_user_deleted_fields` (2025-11-01)

---

## 5. Backend — Danh sách toàn bộ API

Base URL dev: `http://localhost:8085` · Prefix: `/api`

Ký hiệu quyền: 🔓 Public · 🔑 Đăng nhập (CUSTOMER/ADMIN/DELIVERY) · 👑 ADMIN · 🚚 DELIVERY

### 5.1. Auth — `/api/auth` (`authRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/api/auth/register` | 🔓 | Đăng ký (name, email, password, phone, address, role). Set cookies `access_token` + `refresh_token`. Trả `{ user }` |
| POST | `/api/auth/login` | 🔓 | Đăng nhập (email, password). Set cookies JWT. Trả `{ user }` |
| POST | `/api/auth/logout` | 🔑 | Đăng xuất — đưa tokens vào blacklist (nếu bật), xóa cookies |
| POST | `/api/auth/refresh-token` | 🔑 (cookie refresh_token) | Làm mới access token, set cookie mới |
| POST | `/api/auth/forgot-password` | 🔓 | Gửi email khôi phục mật khẩu (Nodemailer) |
| POST | `/api/auth/reset-password` | 🔓 | Đặt lại mật khẩu bằng token từ email (token, password) |

### 5.2. Users — `/api/users` (`userRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/users` | 👑 | Danh sách tất cả user |
| PUT | `/api/users/:id` | 👑 | Cập nhật user (name, email, role, phone, address) |
| DELETE | `/api/users/:id` | 👑 | Xóa user. Query `?force=true` = xóa cứng, mặc định soft delete |
| PUT | `/api/users/:id/password` | 👑 | Admin đặt lại mật khẩu user (newPassword) — ghi PasswordChangeLog |
| GET | `/api/users/profile` | 🔑 | Xem profile của mình |
| PUT | `/api/users/profile` | 🔑 | Cập nhật profile của mình |
| PUT | `/api/users/profile/password` | 🔑 | Tự đổi mật khẩu (currentPassword, newPassword) |

### 5.3. Products — `/api/products` (`productRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/products` | 🔓 | Danh sách SP. Filters: `category, status, isFeatured, isNew, isBestSeller, minPrice, maxPrice` |
| GET | `/api/products/search?q=` | 🔓 | Tìm kiếm theo từ khóa |
| GET | `/api/products/flash-sale` | 🔓 | SP khuyến mãi (flash sale) |
| GET | `/api/products/featured?limit=8` | 🔓 | SP nổi bật |
| GET | `/api/products/newest?limit=8` | 🔓 | SP mới nhất |
| GET | `/api/products/best-selling?limit=8` | 🔓 | SP bán chạy |
| GET | `/api/products/seo/:seoUrl` | 🔓 | SP theo URL SEO |
| GET | `/api/products/:id` | 🔓 | Chi tiết SP |
| PATCH | `/api/products/:id/view` | 🔓 | Tăng lượt xem |
| PATCH | `/api/products/:id/rating` | 🔓 | Đồng bộ lại điểm đánh giá trung bình |
| POST | `/api/products` | 👑 | Tạo SP |
| PUT | `/api/products/:id` | 👑 | Cập nhật SP |
| PATCH | `/api/products/:id/status` | 👑 | Đổi trạng thái (ProductStatus) |
| DELETE | `/api/products/:id` | 👑 | Xóa SP |

### 5.4. Categories — `/api/categories` (`categoryRoutes.ts`)

| Method | Endpoint | Quyền |
|---|---|---|
| GET | `/api/categories` | 🔓 |
| GET | `/api/categories/:id` | 🔓 |
| POST | `/api/categories` | 👑 |
| PUT | `/api/categories/:id` | 👑 |
| DELETE | `/api/categories/:id` | 👑 |

### 5.5. Cart — `/api/cart` (`cartRoutes.ts`) — yêu cầu 🔑

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/cart` | Lấy giỏ hàng của user hiện tại |
| POST | `/api/cart/add` | Thêm SP vào giỏ (productId, quantity, price) |
| PUT | `/api/cart/update/:itemId` | Cập nhật số lượng item |
| DELETE | `/api/cart/remove/:itemId` | Xóa 1 item |
| DELETE | `/api/cart/clear` | Xóa sạch giỏ |

### 5.6. Orders — `/api/orders` (`orderRoutes.ts`) — yêu cầu 🔑 (trừ callback VNPay)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/api/orders` | 🔑 | Tạo đơn (items[], totalPrice, shipping*, note, paymentMethod, promotionCode?, discount?). Nếu `VN_PAY` → trả thêm `paymentUrl`. Tạo Payment record tương ứng |
| GET | `/api/orders/user` | 🔑 | Đơn hàng của tôi (kèm items + payment) |
| PATCH | `/api/orders/:id/cancel` | 🔑 | Hủy đơn của mình |
| GET | `/api/orders/:id` | 🔑 (owner/👑) | Chi tiết đơn |
| GET | `/api/orders/:id/delivery/logs` | 🔑 | Log giao hàng của đơn |
| GET | `/api/orders/:id/delivery/rating` | 🔑 | Xem đánh giá shipper của đơn |
| POST | `/api/orders/:id/delivery/rating` | 🔑 | Tạo đánh giá shipper |
| GET | `/api/orders/delivery` | 🚚 | Danh sách đơn được gán cho shipper. Phân trang + filter: `page, limit, status, name, dateFrom, dateTo, paymentMethod (cod/bank/vnpay/paypal/credit)` |
| POST | `/api/orders/:id/confirm-cod` | 🚚 | Xác nhận đã thu tiền COD (order phải DELIVERED) |
| GET | `/api/orders` | 👑 | Toàn bộ đơn hàng |
| PATCH | `/api/orders/:id/status` | 👑 | Cập nhật trạng thái đơn |
| PATCH | `/api/orders/:id/payment` | 👑 | Cập nhật trạng thái thanh toán (status, transactionId) |
| GET | `/api/orders/vnpay/callback` | 🔓 | Callback VNPay: verify chữ ký → cập nhật Payment COMPLETED/FAILED → redirect về `${FRONTEND_URL}/orders/:id?payment_status=...` |
| GET | `/api/orders/updates` | 🔑 (SSE) | Server-Sent Events đẩy cập nhật đơn theo thời gian thực (token qua query) |

> ⚠️ Lưu ý thứ tự khai báo: `GET /updates` nằm sau `GET /:id` trong file route nên có thể bị `/:id` bắt trước (cần kiểm tra khi sử dụng).

### 5.7. Payments — `/api/payments` (`paymentRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/payments/verify` | 🔓 | Xác minh thanh toán |
| POST | `/api/payments` | 🔑 | Tạo payment (orderId, method, amount) |
| GET | `/api/payments/:id` | 🔑 | Chi tiết payment |
| POST | `/api/payments/:id/refund` | 👑 | Hoàn tiền |

Liên quan: `services/paymentService.ts`, `services/vnpayService.ts` (tạo URL thanh toán VNPay, verify checksum).

### 5.8. Shipping Addresses — `/api/shipping-addresses` — 🔑 (`shippingAddressRoutes.ts`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/shipping-addresses` | Danh sách địa chỉ của tôi |
| GET | `/api/shipping-addresses/:id` | Chi tiết địa chỉ |
| POST | `/api/shipping-addresses` | Tạo địa chỉ mới |
| PUT | `/api/shipping-addresses/:id` | Cập nhật địa chỉ |
| DELETE | `/api/shipping-addresses/:id` | Xóa địa chỉ |
| POST | `/api/shipping-addresses/:id/default` | Đặt làm mặc định |

### 5.9. Reviews — `/api/reviews` (`reviewRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/reviews/product/:productId` | 🔓 | Đánh giá của 1 SP |
| GET | `/api/reviews/user/:userId` | 🔓 | Đánh giá của 1 user |
| GET | `/api/reviews` | 🔓 | Tất cả đánh giá |
| POST | `/api/reviews` | 🔑 | Tạo đánh giá (1 user/SP duy nhất) |
| PUT | `/api/reviews/:id` | 🔑 | Sửa đánh giá của mình |
| DELETE | `/api/reviews/:id` | 🔑 | Xóa đánh giá của mình |

### 5.10. Wishlist — `/api/wishlist` — 🔑 (`wishlistRoutes.ts`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/wishlist` | Danh sách yêu thích |
| POST | `/api/wishlist` | Thêm SP (productId) |
| DELETE | `/api/wishlist/:productId` | Bỏ khỏi yêu thích |
| GET | `/api/wishlist/check/:productId` | Kiểm tra SP có trong wishlist không |

### 5.11. Notifications — `/api/notifications` — 🔑 (`notificationRoutes.ts`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/notifications` | Thông báo của tôi |
| PUT | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc |
| PUT | `/api/notifications/:id/read` | Đánh dấu 1 thông báo đã đọc |
| DELETE | `/api/notifications/:id` | Xóa 1 thông báo |
| DELETE | `/api/notifications` | Xóa tất cả |

### 5.12. Discount Codes — `/api/discount-codes` (`discountCodeRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/api/discount-codes/validate` | 🔑 | Kiểm tra mã hợp lệ (code + giá trị đơn) |
| POST | `/api/discount-codes/apply` | 🔑 | Áp dụng mã vào đơn (trả số tiền giảm) |
| POST | `/api/discount-codes/claim` | 🔑 | Người dùng "lưu nhận" mã |
| GET | `/api/discount-codes/claimed` | 🔑 | Mã đã claim của tôi |
| POST | `/api/discount-codes/usage` | 🔑 | Ghi nhận lượt dùng mã |
| GET | `/api/discount-codes/:id` | 🔑 | Chi tiết mã |
| GET | `/api/discount-codes` | 🔑 | Danh sách mã |
| POST | `/api/discount-codes` | 🔑* | Tạo mã |
| PUT | `/api/discount-codes/:id` | 🔑* | Cập nhật mã |
| DELETE | `/api/discount-codes/:id` | 🔑* | Xóa mã |
| POST | `/api/discount-codes/:id/reset` | 🔑* | Reset lượt dùng (usedCount = 0) |

> *Nhóm CRUD mã hiện chỉ cần đăng nhập (`authenticate`) chứ chưa bắt buộc `requireAdmin` — Admin UI vẫn gọi các endpoint này với tài khoản ADMIN.

### 5.13. Shippers — `/api/shippers` (`shipperRoutes.ts`)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/shippers/orders` | 🚚 | Đơn hàng của shipper |
| GET | `/api/shippers/orders/:orderId/logs` | 🔑 | Lịch sử giao của đơn |
| PATCH | `/api/shippers/orders/:orderId/status` | 🚚 | Shipper cập nhật trạng thái giao (kèm ghi DeliveryLog) |
| POST | `/api/shippers/orders/:orderId/assign` | 👑 | Gán shipper cho đơn |
| GET | `/api/shippers` | 👑 | Danh sách shipper (role DELIVERY) |
| GET | `/api/shippers/:id` | 🔑 | Chi tiết shipper |

### 5.14. Stats — `/api/stats`

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/stats` | 🔑 | Tổng quan thống kê (doanh thu, đơn hàng...) — `statsController.getStats` + `StatsRepository` |

### 5.15. Help Center — `/api/help-center` (FAQ hardcoded trong controller)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/help-center/search?q=` | Tìm kiếm FAQ |
| GET | `/api/help-center/suggestions?q=` | Gợi ý autocomplete FAQ |
| GET | `/api/help-center/wallet/search?q=` | FAQ về Ví |
| GET | `/api/help-center/xu/search?q=` | FAQ về Xu |

### 5.16. Endpoint hệ thống (ngoài `/api`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/test` | Test server |
| GET | `/api/docs` | Swagger UI |

---

## 6. Backend — Xác thực, phân quyền & bảo mật

File: `src/middleware/auth.ts`

### 6.1. Trích xuất token (`extractToken`) — ưu tiên thứ tự:
1. Cookie `access_token` (httpOnly)
2. Header `Authorization: Bearer <token>`
3. Query string `?token=` (chỉ dành cho SSE)

### 6.2. Middleware

| Middleware | Chức năng |
|---|---|
| `authenticate` | Verify JWT (access token) + kiểm tra blacklist → gắn `req.user = { id, role }`. Lỗi: `401 Bạn chưa đăng nhập` / `Token đã bị vô hiệu hóa` / `Token không hợp lệ hoặc đã hết hạn` |
| `requireAdmin` | Chặn nếu `req.user.role !== 'ADMIN'` → `403 Forbidden` |
| `authenticateSSE` | Như authenticate nhưng cho phép token từ query string |
| `refreshToken` | Verify refresh token (JWT + DB `RefreshToken`, check revoked/blacklist) → cấp access token mới vào cookie. Token sai/hết hạn → clear cả 2 cookie + 401 |

### 6.3. Cơ chế token

- **Access token**: JWT HS256, hết hạn `1d`, payload `{ id, role }`, lưu cookie httpOnly 24h.
- **Refresh token**: secret riêng, hết hạn `7d`, lưu cookie httpOnly 7 ngày **và** bảng DB `RefreshToken` (có `deviceInfo`, `revoked`).
- **Token blacklist** (bật qua `JWT_BLACKLIST_ENABLED=true`): khi logout, cả 2 token được hash (SHA) và lưu vào `TokenBlacklist` đến thời điểm exp; mọi request sẽ check blacklist.
- **VNPay**: tạo URL ký HMAC theo spec VNPay; callback verify checksum rồi mới cập nhật trạng thái.
- **Rate limit**: cấu hình sẵn (1000 req/giờ/IP) nhưng đang comment out.
- **Mật khẩu**: hash bằng `bcryptjs`; đổi mật khẩu có log `PasswordChangeLog`; hỗ trợ quên mật khẩu qua email token (Nodemailer, `EMAIL_USER`/`EMAIL_PASS`).

---

## 7. Frontend — Ứng dụng khách hàng

### 7.1. Công nghệ & scripts

- React 19 + TypeScript + Vite (port **5173**), Tailwind CSS v4, Ant Design 6, React Router DOM v7, Zustand, react-hot-toast, dayjs, qrcode.
- Scripts: `yarn dev` / `yarn build` (tsc + vite build) / `yarn lint` / `yarn preview`.
- Dev proxy: `/api` → `http://server-be:8085` (giúp cookie same-origin), kèm CSP header cho phép domain VNPay sandbox.

### 7.2. Kết nối API — `src/services/api.ts`

- `API_URL`: rỗng khi dev (dùng proxy), `VITE_API_URL` khi build prod.
- `fetchWithCredentials` → luôn gửi `credentials: 'include'` (cookie JWT).
- `handleResponse`: ném lỗi từ JSON `{ error/message }`; tự logout khi gặp 401.
- `ENDPOINTS`: tập trung toàn bộ đường dẫn API (AUTH, USER, PRODUCT, ORDER, CART, SHIPPING, WISHLIST, STATS, SEARCH, REVIEW, CATEGORY, PAYMENT, DELIVERY, NOTIFICATION, CONTACT, SHIPPER, HELP_CENTER).

### 7.3. State management — Contexts

| Context | Vai trò |
|---|---|
| `AuthContext` | Đăng nhập/đăng xuất, user hiện tại, `isAuthenticated`, role guard |
| `CartContext` | Giỏ hàng toàn cục |
| `WishlistContext` | Danh sách yêu thích |

### 7.4. Custom hooks (`src/hooks/`)

`useAuthState`, `useCartState`, `useDebounce`, `useFlashSale`, `useLiveChat`, `useLocalStorage`, `useProducts`, `useSearch`, `useShippingAddress`, `useWishlist`.

### 7.5. Bản đồ routes/pages (`src/App.tsx`)

**Auth (AuthLayout):**
| Route | Page |
|---|---|
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password`, `/reset-password` | Quên/đặt lại mật khẩu |

**Shipper (ShipperLayout + ShipperProtectedRoute — chỉ role DELIVERY):**
| Route | Page |
|---|---|
| `/shipper` | Redirect → `/shipper/dashboard` |
| `/shipper/dashboard` | ShipperDashboardPage |
| `/shipper/orders` | ShipperOrdersPage |
| `/shipper/history` | ShipperOrderHistoryPage |
| `/shipper/profile` | ShipperProfilePage |

**Trang chính (Navbar/Footer layout):**
| Route | Page | Ghi chú |
|---|---|---|
| `/` | HomePage | FlashSale, FeaturedProducts, BestSellers, LiveChat, Reviews |
| `/products` · `/products/:id` | ProductsPage · ProductDetailPage | Detail có ProductReviews, tăng view |
| `/categories` · `/search` | CategoriesPage · SearchPage | |
| `/cart` | CartPage | |
| `/checkout` | CheckoutPage | 🔒 ProtectedRoute, PromotionCodeInput, VNPay |
| `/wishlist` | WishlistPage | 🔒 |
| `/flash-sale` · `/featured-products` · `/new-arrivals` · `/best-sellers` | Trang danh sách SP theo nhóm | |
| `/brands` · `/blog` · `/blog/:id` · `/mall` | BrandsPage · BlogPage · MallPage | |
| `/promotion-codes` | DiscountCodePage | Mã giảm giá |
| `/notifications` | NotificationsPage | 🔒 |
| `/user/orders` · `/user/orders/:id` · `/user/profile` | Đơn hàng / chi tiết đơn / hồ sơ | 🔒 roles CUSTOMER, ADMIN |
| `/user/wallet` · `/wallet` | WalletPage / WalletHelpPage | |
| `/user/xu` · `/xu` | XuPage / XuHelpPage | |
| `/help-center` · `/help-center/orders` · `/how-to-buy` · `/return-refund` · `/how-to-sell` · `/warranty` · `/contact` | Trung tâm trợ giúp & CSKH | |
| `/about` · `/terms` · `/privacy` · `/careers` · `/seller` · `/affiliate` · `/media-contact` | Trang giới thiệu & pháp lý | |

**Thành phần chính:** `layout/` (Navbar, Footer, Sidebar, ScrollToTop), `home/` (FlashSale, FeaturedProducts, BestSellersProducts, LiveChat, Reviews, WishlistButton), `product/` (ProductCard, ProductListPage, ProductReviews, ProductSection), `checkout/PromotionCodeInput`, `payment/` (VNPayPayment, VNPayQRCode), `shipper/` (OrderCard, OrderFilter, OrderStatusActions, DeliveryChecklistModal, FailedDeliveryModal, PaymentProofModal, OrderHistoryStats), `user/` (OrderList, ProfileForm), `assets/icons/` (Cashondelivery, Facebook, Mastercard, Visa, VNPay, Youtube, Zalo).

**Services gọi API:** carts, category, contact, discount-codes, flashSale, helpCenter, notification, order (orderService, deliveryService, paymentService), product (productService, categoryService, favoriteService, reviewService), search, shipper, shipping, stats, user, wishlist.

**Utils:** `format` (tiền tệ...), `dateUtils`, `breadcrumb`, `vnpay-init`, `vnpay-timer` (đếm ngược thanh toán VNPay).

---

## 8. Admin — Trang quản trị

### 8.1. Công nghệ & scripts

- React 19 + TS + Vite (port **3001**), Ant Design 6, Recharts (biểu đồ), date-fns, Tailwind CSS v4.
- Scripts: `yarn dev` / `yarn build` / `yarn lint` / `yarn preview`. Dev proxy `/api` → `http://server-be:8085`.

### 8.2. Routes (`src/App.tsx`)

Toàn bộ nằm dưới `/admin` (bọc `AdminRouter` — chặn non-admin, redirect login):

| Route | Thành phần | Chức năng |
|---|---|---|
| `/admin` | AdminWelcome | Trang chào mừng |
| `/admin/dashboard` | DashboardPage | Thống kê (Recharts) |
| `/admin/product-list` | ProductManagement | Quản lý sản phẩm (CRUD, status) |
| `/admin/product-categories` | ProductCategories | Quản lý danh mục |
| `/admin/orders` | OrderList | Quản lý đơn hàng + thanh toán + gán shipper |
| `/admin/shipping` | DeliveryAddress | Quản lý địa chỉ giao |
| `/admin/user-list` | UserManagement | Quản lý user (role, password, xóa) |
| `/admin/shippers` | ShipperList | Quản lý shipper |
| `/admin/discount-codes` | DiscountCode | Quản lý mã giảm giá + reset usage |
| `/admin/reviews` | Reviews | Quản lý/xóa đánh giá |

### 8.3. Services & Auth

- `contexts/AuthContext.tsx`: đăng nhập bằng `/api/auth/login` (cookie-based), guard theo role ADMIN.
- `services/api.ts`: `login`, `getHeaders` (Bearer từ localStorage + cookie), `handleResponse` (401 → chuyển `${VITE_FRONTEND_URL}/login`), cùng các service: shipping addresses, `categoryService`, `promotionService` (discount codes), `shipperService` (filter users role DELIVERY), `reviewService`.
- `services/` khác: `orderService`, `productService`, `userService` (gọi `/api/orders`, `/api/products`, `/api/users`).
- `types/`: order, product, promotion, review, shiper, shipping, stats, user.

---

## 9. Docker & Hạ tầng

### 9.1. Môi trường DEV — `docker-compose.yml`

| Service | Image/Dockerfile | Port (host) | Ghi chú |
|---|---|---|---|
| `server-fe` | frontend/Dockerfile | **5173** | `yarn run dev` (Vite), hot-reload volume |
| `server-be` | backend/Dockerfile | **8085** (+ 9229 debug) | `yarn start:dev` (nodemon + ts-node), `REDIS_HOST=redis`, depends_on db healthy |
| `server-fe-admin` | admin/Dockerfile | **3001** | `yarn run dev` |
| `prisma-studio` | backend/Dockerfile | **5555** | `npx prisma studio` quản trị DB |
| `db` | mysql:8.0 | **3306** | Container `tonic-store`, utf8mb4, TZ Asia/Vietnam, data tại `docker/db/data`, init tại `docker/db/init` |
| `redis` | redis:7-alpine | **6379** | Container `tonic-redis`, volume `redis_data` |
| `phpmyadmin` | phpmyadmin/phpmyadmin | **9000** | PMA_HOST=db, upload 300M |

Network bridge riêng `app-network` (subnet 172.20.0.0/16). Mọi service đều có healthcheck.

### 9.2. Môi trường PRODUCTION — `docker-compose.prod.yml`

| Service | Port | Ghi chú |
|---|---|---|
| `nginx-proxy` | **80 / 443** | Reverse proxy tổng (conf tại `docker/nginx/conf.d`), SSL Let's Encrypt |
| `certbot` | – | Gia hạn chứng chỉ SSL |
| `server-fe` | expose 80 | Build `Dockerfile.prod` (static + nginx) |
| `server-fe-admin` | expose 80 | Build `Dockerfile.prod` |
| `server-be` | expose 8085 | Build `Dockerfile.prod` (node dist) |
| `db` | 3306 | MySQL 8, volume `db_data` |
| `redis` | internal | AOF persistence, không publish port |

Deploy script (CI): `cd /opt/tonic-store && docker-compose -f docker-compose.prod.yml pull && down && up -d --remove-orphans && docker image prune -f`.

---

## 10. CI/CD (GitHub Actions)

File: `.github/workflows/ci.yml` — trigger push/PR vào `main`, `develop`.

**Job 1 — `test`** (Node 22, cache yarn):
1. Cài dependencies cả 3 app (`yarn install --frozen-lockfile`)
2. Backend: `lint` → `build` (tsc)
3. Frontend + Admin: `lint`
4. Chạy tests: backend (jest, `DATABASE_URL=mysql://root:root@127.0.0.1:3306/tonic_store_test`), frontend, admin

**Job 2 — `build`** (chỉ nhánh `main`, cần job test pass):
- Buildx + cache GHA, login DockerHub (`DOCKERHUB_USERNAME/TOKEN`)
- Build & push 3 image: `tonic-store-backend`, `tonic-store-frontend`, `tonic-store-admin` — tag theo SHA/branch/pr/latest

**Job 3 — `deploy`** (chỉ `main`, environment `production`):
- SSH vào server (`SERVER_HOST`, `SERVER_USERNAME`, `SERVER_SSH_KEY`) → pull images → `docker-compose -f docker-compose.prod.yml up -d --remove-orphans`

---

## 11. Biến môi trường

### 11.1. `backend/.env.example`

| Biến | Giá trị ví dụ / ý nghĩa |
|---|---|
| `DATABASE_URL` | `mysql://root:root@db:3306/tonic_store` |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Khóa ký access token / `1d` |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` | Khóa refresh token / `7d` |
| `JWT_BLACKLIST_ENABLED` / `JWT_BLACKLIST_TTL` | Bật blacklist / TTL giây (mặc định 86400) |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail + App Password gửi mail khôi phục mật khẩu |
| `VNPAY_TMN_CODE`, `VNPAY_SECRET_KEY`, `VNPAY_HASH_SECRET` | Thông tin merchant VNPay |
| `VNPAY_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| `VNPAY_RETURN_URL` | URL callback sau thanh toán |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Cache Redis (tùy chọn) |
| `PORT` / `HOST` / `NODE_ENV` | `8085` / `0.0.0.0` / development |
| `FRONTEND_URL` | Dùng cho redirect sau VNPay callback |
| `MYSQL_DATABASE` / `MYSQL_ROOT_PASSWORD` | Khởi tạo container MySQL |

### 11.2. `frontend/.env.example`

```env
VITE_API_URL=http://localhost:8085
VITE_PORT=5173
VITE_FRONTEND_URL=http://localhost:5173
VITE_ADMIN_URL=http://localhost:3001
```

### 11.3. `admin/.env.example`

```env
VITE_API_URL=http://localhost:8085
VITE_PORT=3001
VITE_ADMIN_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173
```

---

## 12. Hướng dẫn cài đặt & chạy dự án

### 12.1. Chạy bằng Docker (khuyến nghị)

```bash
git clone https://github.com/MLISEKAI/tonic-store.git
cd tonic-store

# Thiết lập biến môi trường
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env

# Khởi động toàn bộ (FE 5173 · BE 8085 · Admin 3001 · DB 3306 · Redis 6379 · pMA 9000 · Studio 5555)
docker-compose up -d
```

Sau khi DB đã chạy, áp dụng migrations + seed:

```bash
docker-compose exec server-be yarn prisma:deploy   # prisma migrate deploy
docker-compose exec server-be yarn seed            # dữ liệu mẫu
```

### 12.2. Chạy thủ công

```bash
cd backend  && yarn install && yarn prisma:generate && yarn dev   # :8085
cd frontend && yarn install && yarn dev                           # :5173
cd admin    && yarn install && yarn dev                           # :3001
```

### 12.3. Lệnh hữu ích (backend)

| Lệnh | Chức năng |
|---|---|
| `yarn start:dev` / `yarn build` / `yarn start:prod` | Dev (nodemon) / Build tsc / Chạy dist |
| `yarn lint` · `yarn lint:check` · `yarn format` | ESLint + Prettier |
| `yarn test` · `yarn test:watch` · `yarn test:cov` | Jest unit tests |
| `yarn prisma:migrate` · `yarn prisma:dev` · `yarn prisma:deploy` | Tạo/ap dụng migration |
| `yarn prisma:generate` · `yarn prisma:studio` · `yarn seed` | Generate client / Studio / Seed |

### 12.4. Kiểm tra nhanh hệ thống

| URL | Kết quả mong đợi |
|---|---|
| `http://localhost:8085/health` | `{"status":"ok"}` |
| `http://localhost:8085/api/docs` | Swagger UI |
| `http://localhost:5173` | Website khách hàng |
| `http://localhost:3001/admin` | Trang quản trị (cần tài khoản ADMIN) |
| `http://localhost:5555` | Prisma Studio |
| `http://localhost:9000` | phpMyAdmin |

---

*Tài liệu được sinh tự động từ mã nguồn thực tế của repository — cập nhật lần cuối: 2026-08-23.*
