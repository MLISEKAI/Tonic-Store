🛠️ Tonic Store - Admin Dashboard

Hệ thống quản trị cho Tonic Store, được phát triển bằng React + TypeScript, sử dụng Ant Design, Vite, và TailwindCSS.
Cung cấp giao diện trực quan để quản lý sản phẩm, đơn hàng, người dùng, shipper, mã giảm giá và thống kê.

# Bắt đầu
Yêu cầu hệ thống

Node.js ≥ 16
Yarn hoặc npm

Cài đặt
git clone https://github.com/MLISEKAI/tonic-store.git
cd admin
yarn install

Chạy ứng dụng:
yarn dev

# Dashboard

Thống kê tổng quan (sản phẩm, đơn hàng, doanh thu, người dùng)

Biểu đồ trực quan (Pie, Bar, Doanh số theo danh mục)

Đơn hàng & sản phẩm nổi bật

# Quản lý

Đơn hàng: lọc, cập nhật trạng thái, xem chi tiết, xác nhận thanh toán

Sản phẩm: CRUD, hình ảnh, danh mục, tồn kho

Người dùng: tìm kiếm, phân quyền, xem chi tiết

Shipper: phân công, theo dõi, lịch sử giao hàng

Mã giảm giá: tạo, cập nhật, quản lý hiệu lực & lượt dùng

Đánh giá: xem và quản lý đánh giá khách hàng

# Công nghệ
Frontend	React 18, TypeScript, Vite
UI	Ant Design 5, TailwindCSS
Routing & State	React Router, React Query
Charts & Utils	Recharts, date-fns
Auth	JWT, Protected Routes, Cookies

# Cấu trúc thư mục
admin/
├── src/
│   ├── components/   # UI & module components
│   ├── pages/        # Trang quản lý
│   ├── services/     # API services
│   ├── contexts/     # Auth & global context
│   └── types/        # TypeScript definitions
├── public/
├── dist/
└── vite.config.ts

# Xác thực & Bảo mật

Chỉ ADMIN mới có quyền truy cập Dashboard

JWT-based authentication

Tự động redirect nếu chưa đăng nhập

Cookies được sử dụng để duy trì phiên đăng nhập

# Tác giả

Tran Thanh Loc