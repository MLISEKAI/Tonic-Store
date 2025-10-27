# Tonic Store - Admin Dashboard

## 📋 Giới thiệu

Admin Dashboard là hệ thống quản trị cho Tonic Store, được xây dựng bằng React với TypeScript, sử dụng Ant Design UI và Vite. Hệ thống cung cấp giao diện quản lý toàn diện cho người quản trị, bao gồm quản lý đơn hàng, sản phẩm, người dùng, shipper, mã giảm giá và thống kê.

## Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.x
- Yarn hoặc npm

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd admin
```

2. **Cài đặt dependencies**
```bash
yarn install
# hoặc
npm install
```

3. **Cấu hình biến môi trường**
Tạo file `.env`:
```env
VITE_API_URL=http://localhost:3000
```

4. **Chạy ứng dụng**
```bash
# Development mode
yarn dev

# Production build
yarn build

# Preview production build
yarn preview
```

## Scripts

| Script | Mô tả |
|--------|-------|
| `yarn dev` | Chạy development server với hot reload |
| `yarn build` | Build production bundle |
| `yarn lint` | Chạy ESLint để kiểm tra code |
| `yarn preview` | Preview production build |

## Cấu trúc thư mục

```
admin/
├── src/
│   ├── components/          # React components
│   │   ├── AdminRouter.tsx  # Route protection
│   │   ├── OrderList.tsx    # Quản lý đơn hàng
│   │   ├── UserManagement.tsx
│   │   ├── ProductManagement.tsx
│   │   ├── ShipperList.tsx
│   │   ├── DiscountCode.tsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── AdminPage.tsx    # Main admin page
│   │   ├── DashboardPage.tsx
│   │   └── ShipperManagement.tsx
│   ├── services/            # API services
│   │   ├── api.ts           # API utilities
│   │   ├── orderService.ts
│   │   ├── productService.ts
│   │   ├── userService.ts
│   │   └── shipperService.ts
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── types/               # TypeScript types
│   │   ├── order.ts
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── ...
│   └── App.tsx              # Main app component
├── public/                  # Static assets
├── dist/                    # Build output
├── package.json
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md                # This file
```

## Tính năng chính

### Dashboard (Trang chủ)
- **Thống kê tổng quan**: Hiển thị tổng số sản phẩm, đơn hàng, doanh thu, và người dùng
- **Biểu đồ trực quan**: 
  - Pie chart: Phân tích đơn hàng theo trạng thái
  - Bar chart: Top sản phẩm bán chạy
  - Doanh số theo danh mục
- **Đơn hàng gần đây**: Hiển thị 5 đơn hàng mới nhất
- **Top sản phẩm**: Sản phẩm bán chạy nhất

### Quản lý Đơn hàng
- Xem danh sách tất cả đơn hàng
- Lọc đơn hàng theo trạng thái (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Cập nhật trạng thái đơn hàng
- Xem chi tiết đơn hàng (sản phẩm, người nhận, thanh toán)
- Quản lý thanh toán đơn hàng

### Quản lý Người dùng
- Xem danh sách tất cả người dùng
- Tìm kiếm người dùng theo tên hoặc email
- Xem thông tin chi tiết người dùng
- Phân quyền người dùng (CUSTOMER, ADMIN, DELIVERY)

### Quản lý Sản phẩm
- Xem danh sách sản phẩm
- Thêm sản phẩm mới
- Chỉnh sửa thông tin sản phẩm
- Xóa sản phẩm
- Quản lý danh mục sản phẩm
- Quản lý số lượng tồn kho
- Hiển thị hình ảnh sản phẩm

### Quản lý Shipper
- Danh sách shipper (DELIVERY)
- Phân công shipper cho đơn hàng
- Theo dõi đơn hàng của shipper
- Xem lịch sử giao hàng

### Quản lý Mã giảm giá
- Tạo mã giảm giá mới
- Xem danh sách mã giảm giá
- Cập nhật thông tin mã giảm giá
- Theo dõi lượt sử dụng mã giảm giá
- Quản lý thời gian hiệu lực

### Quản lý Địa chỉ Giao hàng
- Xem danh sách địa chỉ giao hàng của người dùng
- Quản lý địa chỉ giao hàng

### Quản lý Đánh giá
- Xem đánh giá của khách hàng về sản phẩm
- Quản lý đánh giá (xóa nếu cần)

## Công nghệ sử dụng

### Frontend Framework
- **React 18.2**: UI framework
- **TypeScript 5.2**: Type safety
- **Vite 5.1**: Build tool và dev server

### UI Library
- **Ant Design 5.15**: Component library
- **TailwindCSS 4.1**: Utility-first CSS

### Các thư viện khác
- **React Router 6.22**: Routing
- **Recharts 2.12**: Biểu đồ và visualization
- **date-fns 4.1**: Xử lý ngày tháng

## Xác thực

- Admin Dashboard yêu cầu đăng nhập với quyền ADMIN
- Sử dụng JWT authentication
- Protected routes tự động redirect về trang login nếu chưa đăng nhập
- Session được quản lý qua cookies

## UI/UX

- **Responsive design**: Hoạt động tốt trên mọi kích thước màn hình
- **Ant Design theme**: Giao diện nhất quán và hiện đại
- **Interactive charts**: Biểu đồ tương tác với Recharts
- **Real-time updates**: Cập nhật dữ liệu real-time
- **Loading states**: Hiển thị trạng thái loading rõ ràng

## Features chi tiết

### Dashboard Statistics
- **Total Products**: Tổng số sản phẩm trong hệ thống
- **Total Orders**: Tổng số đơn hàng
- **Total Revenue**: Tổng doanh thu
- **Total Users**: Tổng số người dùng

### Order Management
- Lọc và tìm kiếm đơn hàng
- Cập nhật trạng thái đơn hàng
- Xem chi tiết đơn hàng đầy đủ
- Quản lý payment status

### Product Management
- CRUD operations cho sản phẩm
- Upload hình ảnh sản phẩm
- Quản lý inventory
- Phân loại danh mục

### User Management
- Quản lý tài khoản người dùng
- Phân quyền và roles
- Xem hoạt động của người dùng

## Development

### Hot Module Replacement
Vite cung cấp HMR siêu nhanh cho development experience tốt nhất.

### Type Safety
TypeScript được cấu hình strict để đảm bảo type safety tối đa.

### Code Style
- ESLint cho code quality
- Prettier cho code formatting
- Consistent coding standards

## Notes

- API endpoint có thể được cấu hình trong `.env`
- Cookies được sử dụng cho authentication
- Tất cả API requests sử dụng credentials
- Development mode hỗ trợ proxy API để tránh CORS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- Tran Thanh Loc

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository hoặc liên hệ team phát triển.



