import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import bcrypt from 'bcryptjs';

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('Admin user created:', admin);

    // Create categories
    const categories = [
        'Thời Trang Nam',
        'Thời Trang Nữ',
        'Điện Thoại & Phụ Kiện',
        'Mẹ & Bé',
        'Thiết Bị Điện Tử',
        'Nhà Cửa & Đời Sống',
        'Máy Tính & Laptop',
        'Sắc Đẹp',
        'Máy Ảnh & Máy Quay Phim',
        'Sức Khỏe',
        'Đồng Hồ',
        'Giày Dép Nữ',
        'Giày Dép Nam',
        'Túi Ví Nữ',
        'Thiết Bị Điện Gia Dụng',
        'Phụ Kiện & Trang Sức Nữ',
        'Thể Thao & Du Lịch',
        'Bách Hóa Online',
        'Ô Tô & Xe Máy & Xe Đạp',
        'Nhà Sách Online',
        'Balo & Túi Ví Nam',
        'Thời Trang Trẻ Em',
        'Đồ Chơi',
        'Giặt Giũ & Chăm Sóc Nhà Cửa',
        'Chăm Sóc Thú Cưng',
        'Voucher & Dịch Vụ',
        'Dụng cụ và thiết bị tiện ích'
    ];

    const createdCategories = new Map<string, number>();

    for (const categoryName of categories) {
        const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName }
        });
        createdCategories.set(categoryName, category.id);
    }

    console.log('Categories created successfully');

    interface SeedProduct {
        id?: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        imageUrl: string;
        categoryId?: number;
    }

    // Create sample products
    const products: SeedProduct[] = [
        // Thời Trang Nam
        {
            name: "Áo thun nam cổ tròn",
            description: "Áo thun nam cổ tròn chất liệu cotton 100%",
            price: 29.99,
            stock: 100,
            imageUrl: "https://example.com/ao-thun-nam.jpg",
            categoryId: createdCategories.get("Thời Trang Nam")
        },
        // Thời Trang Nữ
        {
            name: "Váy liền thân",
            description: "Váy liền thân dáng suông phong cách Hàn Quốc",
            price: 49.99,
            stock: 80,
            imageUrl: "https://example.com/vay-lien-than.jpg",
            categoryId: createdCategories.get("Thời Trang Nữ")
        },
        // Điện Thoại & Phụ Kiện
        {
            name: "iPhone 15 Pro Max",
            description: "Apple iPhone 15 Pro Max 256GB - Titanium Blue",
            price: 1299.99,
            stock: 50,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816",
            categoryId: createdCategories.get("Điện Thoại & Phụ Kiện")
        },
        // Mẹ & Bé
        {
            name: "Xe đẩy em bé",
            description: "Xe đẩy em bé đa năng, gấp gọn dễ dàng",
            price: 199.99,
            stock: 30,
            imageUrl: "https://example.com/xe-day-em-be.jpg",
            categoryId: createdCategories.get("Mẹ & Bé")
        },
        // Thiết Bị Điện Tử
        {
            name: "AirPods Pro 2",
            description: "Apple AirPods Pro (2nd generation) với MagSafe",
            price: 249.99,
            stock: 100,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361",
            categoryId: createdCategories.get("Thiết Bị Điện Tử")
        },
        // Nhà Cửa & Đời Sống
        {
            name: "Bộ bàn ăn 6 ghế",
            description: "Bộ bàn ăn gỗ tự nhiên 6 ghế phong cách hiện đại",
            price: 599.99,
            stock: 20,
            imageUrl: "https://example.com/bo-ban-an.jpg",
            categoryId: createdCategories.get("Nhà Cửa & Đời Sống")
        },
        // Máy Tính & Laptop
        {
            name: "MacBook Pro M3",
            description: "Apple MacBook Pro 14-inch M3 Pro chip 18GB RAM 512GB SSD",
            price: 1999.99,
            stock: 30,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m3-max-pro-space-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311053610",
            categoryId: createdCategories.get("Máy Tính & Laptop")
        },
        // Sắc Đẹp
        {
            name: "Son môi lì",
            description: "Son môi lì không trôi màu, bảng màu đa dạng",
            price: 19.99,
            stock: 200,
            imageUrl: "https://example.com/son-moi-li.jpg",
            categoryId: createdCategories.get("Sắc Đẹp")
        },
        // Máy Ảnh & Máy Quay Phim
        {
            name: "Máy ảnh Sony A7IV",
            description: "Máy ảnh mirrorless Sony A7IV full-frame",
            price: 2499.99,
            stock: 15,
            imageUrl: "https://example.com/sony-a7iv.jpg",
            categoryId: createdCategories.get("Máy Ảnh & Máy Quay Phim")
        },
        // Sức Khỏe
        {
            name: "Máy đo huyết áp",
            description: "Máy đo huyết áp điện tử tự động",
            price: 49.99,
            stock: 50,
            imageUrl: "https://example.com/may-do-huyet-ap.jpg",
            categoryId: createdCategories.get("Sức Khỏe")
        },
        // Đồng Hồ
        {
            name: "Apple Watch Series 9",
            description: "Apple Watch Series 9 GPS 45mm Aluminum Case",
            price: 429.99,
            stock: 55,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1683224241054",
            categoryId: createdCategories.get("Đồng Hồ")
        },
        // Giày Dép Nữ
        {
            name: "Giày cao gót",
            description: "Giày cao gót da thật 7cm",
            price: 59.99,
            stock: 40,
            imageUrl: "https://example.com/giay-cao-got.jpg",
            categoryId: createdCategories.get("Giày Dép Nữ")
        },
        // Giày Dép Nam
        {
            name: "Giày thể thao nam",
            description: "Giày thể thao nam đế êm, thông thoáng",
            price: 79.99,
            stock: 60,
            imageUrl: "https://example.com/giay-the-thao-nam.jpg",
            categoryId: createdCategories.get("Giày Dép Nam")
        },
        // Túi Ví Nữ
        {
            name: "Túi xách nữ",
            description: "Túi xách nữ da thật phong cách Hàn Quốc",
            price: 89.99,
            stock: 35,
            imageUrl: "https://example.com/tui-xach-nu.jpg",
            categoryId: createdCategories.get("Túi Ví Nữ")
        },
        // Thiết Bị Điện Gia Dụng
        {
            name: "Máy xay sinh tố",
            description: "Máy xay sinh tố đa năng công suất cao",
            price: 69.99,
            stock: 45,
            imageUrl: "https://example.com/may-xay-sinh-to.jpg",
            categoryId: createdCategories.get("Thiết Bị Điện Gia Dụng")
        },
        // Phụ Kiện & Trang Sức Nữ
        {
            name: "Vòng tay bạc",
            description: "Vòng tay bạc 925 đính đá",
            price: 39.99,
            stock: 70,
            imageUrl: "https://example.com/vong-tay-bac.jpg",
            categoryId: createdCategories.get("Phụ Kiện & Trang Sức Nữ")
        },
        // Thể Thao & Du Lịch
        {
            name: "Balo du lịch",
            description: "Balo du lịch chống nước 30L",
            price: 49.99,
            stock: 40,
            imageUrl: "https://example.com/balo-du-lich.jpg",
            categoryId: createdCategories.get("Thể Thao & Du Lịch")
        },
        // Bách Hóa Online
        {
            name: "Khẩu trang y tế",
            description: "Khẩu trang y tế 3 lớp 50 cái",
            price: 9.99,
            stock: 500,
            imageUrl: "https://example.com/khau-trang.jpg",
            categoryId: createdCategories.get("Bách Hóa Online")
        },
        // Ô Tô & Xe Máy & Xe Đạp
        {
            name: "Mũ bảo hiểm",
            description: "Mũ bảo hiểm xe máy đạt chuẩn",
            price: 29.99,
            stock: 100,
            imageUrl: "https://example.com/mu-bao-hiem.jpg",
            categoryId: createdCategories.get("Ô Tô & Xe Máy & Xe Đạp")
        },
        // Nhà Sách Online
        {
            name: "Sách dạy nấu ăn",
            description: "Sách dạy nấu ăn 100 món ngon",
            price: 19.99,
            stock: 80,
            imageUrl: "https://example.com/sach-nau-an.jpg",
            categoryId: createdCategories.get("Nhà Sách Online")
        },
        // Balo & Túi Ví Nam
        {
            name: "Balo laptop nam",
            description: "Balo laptop nam chống nước",
            price: 59.99,
            stock: 45,
            imageUrl: "https://example.com/balo-laptop-nam.jpg",
            categoryId: createdCategories.get("Balo & Túi Ví Nam")
        },
        // Thời Trang Trẻ Em
        {
            name: "Áo thun trẻ em",
            description: "Áo thun trẻ em chất liệu cotton mềm mại",
            price: 15.99,
            stock: 120,
            imageUrl: "https://example.com/ao-thun-tre-em.jpg",
            categoryId: createdCategories.get("Thời Trang Trẻ Em")
        },
        // Đồ Chơi
        {
            name: "Lego thành phố",
            description: "Bộ xếp hình Lego thành phố 1000 mảnh",
            price: 79.99,
            stock: 30,
            imageUrl: "https://example.com/lego-thanh-pho.jpg",
            categoryId: createdCategories.get("Đồ Chơi")
        },
        // Giặt Giũ & Chăm Sóc Nhà Cửa
        {
            name: "Nước giặt",
            description: "Nước giặt hương thơm tự nhiên 3L",
            price: 12.99,
            stock: 200,
            imageUrl: "https://example.com/nuoc-giat.jpg",
            categoryId: createdCategories.get("Giặt Giũ & Chăm Sóc Nhà Cửa")
        },
        // Chăm Sóc Thú Cưng
        {
            name: "Thức ăn cho chó",
            description: "Thức ăn hạt cho chó trưởng thành 5kg",
            price: 39.99,
            stock: 60,
            imageUrl: "https://example.com/thuc-an-cho-cho.jpg",
            categoryId: createdCategories.get("Chăm Sóc Thú Cưng")
        },
        // Voucher & Dịch Vụ
        {
            name: "Voucher spa",
            description: "Voucher chăm sóc da mặt tại spa",
            price: 99.99,
            stock: 50,
            imageUrl: "https://example.com/voucher-spa.jpg",
            categoryId: createdCategories.get("Voucher & Dịch Vụ")
        },
        // Dụng cụ và thiết bị tiện ích
        {
            name: "Bộ dụng cụ sửa chữa",
            description: "Bộ dụng cụ sửa chữa đa năng 100 món",
            price: 49.99,
            stock: 40,
            imageUrl: "https://example.com/bo-dung-cu-sua-chua.jpg",
            categoryId: createdCategories.get("Dụng cụ và thiết bị tiện ích")
        }
    ];

    for (const product of products) {
        if (product.categoryId) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    categoryId: product.categoryId
                }
            });
        }
    }

    console.log('Sample products created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
