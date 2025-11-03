# Tonic Store - Admin Dashboard

**Tonic Store Admin** là hệ thống quản trị dành cho nền tảng thương mại điện tử **Tonic Store**, được phát triển bằng **React + TypeScript**, sử dụng **Ant Design**, **Vite**, và **TailwindCSS**.  
Cung cấp giao diện trực quan để quản lý **sản phẩm, đơn hàng, người dùng, shipper, mã giảm giá** và **thống kê doanh thu**.

---

## Bắt đầu

### Yêu cầu hệ thống
- Node.js ≥ 16  
- Yarn hoặc npm

### Cài đặt
```bash
git clone https://github.com/MLISEKAI/tonic-store.git
cd admin
yarn install

## Chạy ứng dụng
yarn dev

## Cách xác nhận đơn hàng

Tài khoản admin:

Email: admin@example.com  
Mật khẩu: admin123

Quy trình:

Đăng nhập bằng tài khoản admin.

Vào trang Quản lý Shipper, tạo tài khoản shipper.

Đăng xuất tài khoản admin và đăng nhập bằng tài khoản shipper vừa tạo.

Tài khoản shipper mới có thể xác nhận giao hàng.

# Dashboard

Thống kê tổng quan (sản phẩm, đơn hàng, doanh thu, người dùng)

Biểu đồ trực quan: Pie, Bar, Doanh số theo danh mục

Hiển thị đơn hàng & sản phẩm nổi bật

# Quản lý
## Đơn hàng

Lọc, cập nhật trạng thái, xem chi tiết

Xác nhận thanh toán & giao hàng

## Sản phẩm

CRUD (tạo, sửa, xóa, xem)

Hình ảnh, danh mục, tồn kho

##Người dùng

Tìm kiếm, phân quyền, xem chi tiết

## Shipper

Phân công, theo dõi, xem lịch sử giao hàng

## Mã giảm giá

Tạo, cập nhật, quản lý hiệu lực & lượt dùng

## Đánh giá

Xem & quản lý đánh giá của khách hàng

## Công nghệ
Thành phần	Công nghệ sử dụng
Frontend	React 18, TypeScript, Vite
UI	Ant Design 5, TailwindCSS
Routing & State	React Router, React Query
Charts & Utils	Recharts, date-fns
Auth	JWT, Protected Routes, Cookies

##Tác giả

Tran Thanh Loc
Cảm ơn cộng đồng mã nguồn mở và tất cả những người đóng góp! 💙