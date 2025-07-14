# Repository Pattern Implementation

## Tổng quan

Repository pattern đã được implement để tách biệt logic truy xuất dữ liệu ra khỏi business logic trong các service. Điều này giúp code dễ maintain, test và mở rộng hơn.

## Cấu trúc

```
repositories/
├── interfaces/
│   ├── IBaseRepository.ts      # Interface cơ bản cho CRUD operations
│   ├── IUserRepository.ts      # Interface cho User operations
│   ├── IProductRepository.ts   # Interface cho Product operations
│   └── IOrderRepository.ts     # Interface cho Order operations
├── UserRepository.ts           # Implementation cho User
├── ProductRepository.ts        # Implementation cho Product
├── OrderRepository.ts          # Implementation cho Order
├── index.ts                    # Export tất cả repositories
└── README.md                   # File này
```

## Lợi ích

### 1. Tách biệt Concerns
- **Repository**: Chỉ chịu trách nhiệm truy xuất dữ liệu
- **Service**: Chỉ chịu trách nhiệm business logic

### 2. Dễ Test
- Có thể mock Repository để test Service
- Test Repository riêng biệt với database

### 3. Dễ Maintain
- Thay đổi database logic chỉ cần sửa Repository
- Business logic không bị ảnh hưởng

### 4. Reusability
- Repository có thể được sử dụng bởi nhiều Service
- Tránh duplicate code

## Cách sử dụng

### Trong Service
```typescript
import { UserRepository } from '../repositories';

const userRepository = new UserRepository();

// Thay vì truy cập trực tiếp Prisma
// const user = await prisma.user.findUnique({ where: { id } });

// Sử dụng Repository
const user = await userRepository.findById(id);
```

### Interface Pattern
```typescript
// Định nghĩa interface
export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  // ...
}

// Implementation
export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // ...
}
```

## Các Repository đã implement

### 1. UserRepository
- CRUD operations cho User
- Password management
- Select fields optimization
- Transaction support cho password change

### 2. ProductRepository
- CRUD operations cho Product
- Search functionality
- Stock management
- Category filtering
- Flash sale, newest, best selling products

### 3. OrderRepository
- CRUD operations cho Order
- Order status management
- Payment integration
- Notification system
- Delivery logging

## Migration từ Service cũ

### Trước (Service trực tiếp truy cập Prisma)
```typescript
export const getUserProfile = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      // ...
    },
  });
};
```

### Sau (Service sử dụng Repository)
```typescript
export const getUserProfile = async (userId: number) => {
  return userRepository.findUserByIdWithSelect(userId, userSelectFields);
};
```

## Best Practices

1. **Interface First**: Luôn định nghĩa interface trước khi implement
2. **Single Responsibility**: Mỗi Repository chỉ chịu trách nhiệm cho một entity
3. **Consistent Naming**: Sử dụng naming convention nhất quán
4. **Error Handling**: Xử lý lỗi ở Repository level
5. **Type Safety**: Sử dụng TypeScript types cho tất cả operations

## Mở rộng

Để thêm Repository mới:

1. Tạo interface trong `interfaces/`
2. Implement Repository class
3. Export trong `index.ts`
4. Update Service để sử dụng Repository mới

## Testing

```typescript
// Mock Repository cho testing
const mockUserRepository = {
  findById: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(newUser),
  // ...
};

// Test Service với mock Repository
const userService = new UserService(mockUserRepository);
``` 