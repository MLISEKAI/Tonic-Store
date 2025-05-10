import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import bcrypt from 'bcryptjs';

async function main() {
    try {
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
            viewCount?: number;
            soldCount?: number;
            rating?: number;
            status?: string;
            sku: string;
            barcode?: string;
            weight?: number;
            dimensions?: string;
            material?: string;
            origin?: string;
            warranty?: string;
            seoTitle?: string;
            seoDescription?: string;
            seoUrl?: string;
            isFeatured?: boolean;
            isNew?: boolean;
            isBestSeller?: boolean;
        }

        // Create sample products
        const products: SeedProduct[] = [
            // Thời Trang Nam
            {
                name: "Áo thun nam cổ tròn",
                description: "Áo thun nam cổ tròn chất liệu cotton 100%",
                price: 299000,
                stock: 100,
                imageUrl: "https://example.com/ao-thun-nam.jpg",
                categoryId: createdCategories.get("Thời Trang Nam"),
                viewCount: 1500,
                soldCount: 200,
                rating: 4.5,
                status: "ACTIVE",
                sku: "TTN-AT001",
                barcode: "123456789012",
                weight: 0.2,
                dimensions: "M",
                material: "Cotton",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Áo thun nam cổ tròn - Chất liệu cotton 100%",
                seoDescription: "Áo thun nam cổ tròn chất liệu cotton 100%, thoáng mát, dễ mặc.",
                seoUrl: "ao-thun-nam-co-tron",
                isFeatured: true,
                isNew: true,
                isBestSeller: false
            },
            // Thời Trang Nữ
            {
                name: "Váy liền thân",
                description: "Váy liền thân dáng suông phong cách Hàn Quốc",
                price: 499000,
                stock: 80,
                imageUrl: "https://example.com/vay-lien-than.jpg",
                categoryId: createdCategories.get("Thời Trang Nữ"),
                viewCount: 2000,
                soldCount: 150,
                rating: 4.8,
                status: "ACTIVE",
                sku: "TTN-VL001",
                barcode: "234567890123",
                weight: 0.3,
                dimensions: "S",
                material: "Polyester",
                origin: "Hàn Quốc",
                warranty: "Không có",
                seoTitle: "Váy liền thân - Phong cách Hàn Quốc",
                seoDescription: "Váy liền thân dáng suông phong cách Hàn Quốc, thời trang, dễ mặc.",
                seoUrl: "vay-lien-than",
                isFeatured: false,
                isNew: true,
                isBestSeller: true
            },
            // Điện Thoại & Phụ Kiện
            {
                name: "iPhone 15 Pro Max",
                description: "Apple iPhone 15 Pro Max 256GB - Titanium Blue",
                price: 32990000,
                stock: 50,
                imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816",
                categoryId: createdCategories.get("Điện Thoại & Phụ Kiện"),
                viewCount: 5000,
                soldCount: 100,
                rating: 4.9,
                status: "ACTIVE",
                sku: "DTP-IP15PM-256-BLUE",
                barcode: "345678901234",
                weight: 0.5,
                dimensions: "6.7 inch",
                material: "Titanium",
                origin: "Trung Quốc",
                warranty: "12 tháng",
                seoTitle: "iPhone 15 Pro Max - Titanium Blue",
                seoDescription: "Apple iPhone 15 Pro Max 256GB - Titanium Blue, công nghệ mới nhất.",
                seoUrl: "iphone-15-pro-max",
                isFeatured: true,
                isNew: true,
                isBestSeller: true
            },
            // Mẹ & Bé
            {
                name: "Xe đẩy em bé",
                description: "Xe đẩy em bé đa năng, gấp gọn dễ dàng",
                price: 199.99,
                stock: 30,
                imageUrl: "https://example.com/xe-day-em-be.jpg",
                categoryId: createdCategories.get("Mẹ & Bé"),
                viewCount: 800,
                soldCount: 50,
                rating: 4.7,
                status: "ACTIVE",
                sku: "MB-XD001",
                barcode: "456789012345",
                weight: 10.0,
                dimensions: "100x50x80 cm",
                material: "Nhôm",
                origin: "Đức",
                warranty: "24 tháng",
                seoTitle: "Xe đẩy em bé đa năng",
                seoDescription: "Xe đẩy em bé đa năng, gấp gọn dễ dàng, an toàn cho bé.",
                seoUrl: "xe-day-em-be",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Thiết Bị Điện Tử
            {
                name: "AirPods Pro 2",
                description: "Apple AirPods Pro (2nd generation) với MagSafe",
                price: 249.99,
                stock: 100,
                imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361",
                categoryId: createdCategories.get("Thiết Bị Điện Tử"),
                viewCount: 3000,
                soldCount: 200,
                rating: 4.8,
                status: "ACTIVE",
                sku: "TBD-APP2",
                barcode: "567890123456",
                weight: 0.1,
                dimensions: "5x5x2 cm",
                material: "Nhựa",
                origin: "Trung Quốc",
                warranty: "12 tháng",
                seoTitle: "AirPods Pro 2 - MagSafe",
                seoDescription: "Apple AirPods Pro (2nd generation) với MagSafe, âm thanh sống động.",
                seoUrl: "airpods-pro-2",
                isFeatured: true,
                isNew: true,
                isBestSeller: true
            },
            // Nhà Cửa & Đời Sống
            {
                name: "Bộ bàn ăn 6 ghế",
                description: "Bộ bàn ăn gỗ tự nhiên 6 ghế phong cách hiện đại",
                price: 599.99,
                stock: 20,
                imageUrl: "https://example.com/bo-ban-an.jpg",
                categoryId: createdCategories.get("Nhà Cửa & Đời Sống"),
                viewCount: 1200,
                soldCount: 30,
                rating: 4.6,
                status: "ACTIVE",
                sku: "NCD-BA001",
                barcode: "678901234567",
                weight: 50.0,
                dimensions: "180x90x75 cm",
                material: "Gỗ",
                origin: "Việt Nam",
                warranty: "36 tháng",
                seoTitle: "Bộ bàn ăn 6 ghế - Gỗ tự nhiên",
                seoDescription: "Bộ bàn ăn gỗ tự nhiên 6 ghế phong cách hiện đại, bền đẹp.",
                seoUrl: "bo-ban-an-6-ghe",
                isFeatured: false,
                isNew: false,
                isBestSeller: false
            },
            // Máy Tính & Laptop
            {
                name: "MacBook Pro M3",
                description: "Apple MacBook Pro 14-inch M3 Pro chip 18GB RAM 512GB SSD",
                price: 1999.99,
                stock: 30,
                imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m3-max-pro-space-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311053610",
                categoryId: createdCategories.get("Máy Tính & Laptop"),
                status: "ACTIVE",
                sku: "MTL-MBP14-M3-512",
                barcode: "789012345678",
                weight: 1.5,
                dimensions: "14 inch",
                material: "Nhôm",
                origin: "Trung Quốc",
                warranty: "12 tháng",
                seoTitle: "MacBook Pro M3 - 14 inch",
                seoDescription: "Apple MacBook Pro 14-inch M3 Pro chip 18GB RAM 512GB SSD, hiệu suất cao.",
                seoUrl: "macbook-pro-m3",
                isFeatured: true,
                isNew: true,
                isBestSeller: true
            },
            // Sắc Đẹp
            {
                name: "Son môi lì",
                description: "Son môi lì không trôi màu, bảng màu đa dạng",
                price: 19.99,
                stock: 200,
                imageUrl: "https://example.com/son-moi-li.jpg",
                categoryId: createdCategories.get("Sắc Đẹp"),
                viewCount: 2500,
                soldCount: 300,
                rating: 4.7,
                status: "ACTIVE",
                sku: "SD-SM001",
                barcode: "890123456789",
                weight: 0.05,
                dimensions: "3x3x10 cm",
                material: "Sáp",
                origin: "Pháp",
                warranty: "Không có",
                seoTitle: "Son môi lì - Không trôi màu",
                seoDescription: "Son môi lì không trôi màu, bảng màu đa dạng, dưỡng môi.",
                seoUrl: "son-moi-li",
                isFeatured: false,
                isNew: true,
                isBestSeller: true
            },
            // Máy Ảnh & Máy Quay Phim
            {
                name: "Máy ảnh Sony A7IV",
                description: "Máy ảnh mirrorless Sony A7IV full-frame",
                price: 2499.99,
                stock: 15,
                imageUrl: "https://example.com/sony-a7iv.jpg",
                categoryId: createdCategories.get("Máy Ảnh & Máy Quay Phim"),
                viewCount: 1800,
                soldCount: 25,
                rating: 4.8,
                status: "ACTIVE",
                sku: "MA-SONY-A7IV",
                barcode: "901234567890",
                weight: 0.8,
                dimensions: "5x5x10 cm",
                material: "Nhựa",
                origin: "Nhật Bản",
                warranty: "24 tháng",
                seoTitle: "Máy ảnh Sony A7IV - Full-frame",
                seoDescription: "Máy ảnh mirrorless Sony A7IV full-frame, chất lượng hình ảnh cao.",
                seoUrl: "may-anh-sony-a7iv",
                isFeatured: true,
                isNew: true,
                isBestSeller: false
            },
            // Sức Khỏe
            {
                name: "Máy đo huyết áp",
                description: "Máy đo huyết áp điện tử tự động",
                price: 49.99,
                stock: 50,
                imageUrl: "https://example.com/may-do-huyet-ap.jpg",
                categoryId: createdCategories.get("Sức Khỏe"),
                viewCount: 900,
                soldCount: 40,
                rating: 4.6,
                status: "ACTIVE",
                sku: "SK-MDHA001",
                barcode: "012345678901",
                weight: 0.3,
                dimensions: "10x5x5 cm",
                material: "Nhựa",
                origin: "Đức",
                warranty: "12 tháng",
                seoTitle: "Máy đo huyết áp điện tử",
                seoDescription: "Máy đo huyết áp điện tử tự động, dễ sử dụng, chính xác.",
                seoUrl: "may-do-huyet-ap",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Đồng Hồ
            {
                name: "Apple Watch Series 9",
                description: "Apple Watch Series 9 GPS 45mm Aluminum Case",
                price: 429.99,
                stock: 55,
                imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1683224241054",
                categoryId: createdCategories.get("Đồng Hồ"),
                viewCount: 3500,
                soldCount: 120,
                rating: 4.8,
                status: "ACTIVE",
                sku: "DH-AWS9-45",
                barcode: "123456789012",
                weight: 0.2,
                dimensions: "45mm",
                material: "Nhôm",
                origin: "Trung Quốc",
                warranty: "12 tháng",
                seoTitle: "Apple Watch Series 9 - 45mm",
                seoDescription: "Apple Watch Series 9 GPS 45mm Aluminum Case, thông minh, đa năng.",
                seoUrl: "apple-watch-series-9",
                isFeatured: true,
                isNew: true,
                isBestSeller: true
            },
            // Giày Dép Nữ
            {
                name: "Giày cao gót",
                description: "Giày cao gót da thật 7cm",
                price: 59.99,
                stock: 40,
                imageUrl: "https://example.com/giay-cao-got.jpg",
                categoryId: createdCategories.get("Giày Dép Nữ"),
                viewCount: 1600,
                soldCount: 60,
                rating: 4.7,
                status: "ACTIVE",
                sku: "GDN-GCG001",
                barcode: "234567890123",
                weight: 0.4,
                dimensions: "38",
                material: "Da",
                origin: "Ý",
                warranty: "Không có",
                seoTitle: "Giày cao gót - Da thật",
                seoDescription: "Giày cao gót da thật 7cm, thời trang, dễ mặc.",
                seoUrl: "giay-cao-got",
                isFeatured: false,
                isNew: true,
                isBestSeller: true
            },
            // Giày Dép Nam
            {
                name: "Giày thể thao nam",
                description: "Giày thể thao nam đế êm, thông thoáng",
                price: 79.99,
                stock: 60,
                imageUrl: "https://example.com/giay-the-thao-nam.jpg",
                categoryId: createdCategories.get("Giày Dép Nam"),
                viewCount: 2000,
                soldCount: 90,
                rating: 4.6,
                status: "ACTIVE",
                sku: "GDN-GTT001",
                barcode: "345678901234",
                weight: 0.5,
                dimensions: "42",
                material: "Vải",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Giày thể thao nam - Đế êm",
                seoDescription: "Giày thể thao nam đế êm, thông thoáng, dễ mặc.",
                seoUrl: "giay-the-thao-nam",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Túi Ví Nữ
            {
                name: "Túi xách nữ",
                description: "Túi xách nữ da thật phong cách Hàn Quốc",
                price: 89.99,
                stock: 35,
                imageUrl: "https://example.com/tui-xach-nu.jpg",
                categoryId: createdCategories.get("Túi Ví Nữ"),
                viewCount: 1400,
                soldCount: 45,
                rating: 4.7,
                status: "ACTIVE",
                sku: "TVN-TX001",
                barcode: "456789012345",
                weight: 0.6,
                dimensions: "30x20x10 cm",
                material: "Da",
                origin: "Hàn Quốc",
                warranty: "Không có",
                seoTitle: "Túi xách nữ - Da thật",
                seoDescription: "Túi xách nữ da thật phong cách Hàn Quốc, thời trang, dễ mặc.",
                seoUrl: "tui-xach-nu",
                isFeatured: false,
                isNew: true,
                isBestSeller: false
            },
            // Thiết Bị Điện Gia Dụng
            {
                name: "Máy xay sinh tố",
                description: "Máy xay sinh tố đa năng công suất cao",
                price: 69.99,
                stock: 45,
                imageUrl: "https://example.com/may-xay-sinh-to.jpg",
                categoryId: createdCategories.get("Thiết Bị Điện Gia Dụng"),
                viewCount: 1100,
                soldCount: 55,
                rating: 4.5,
                status: "ACTIVE",
                sku: "TBĐ-MXST001",
                barcode: "567890123456",
                weight: 1.0,
                dimensions: "20x20x30 cm",
                material: "Nhựa",
                origin: "Đức",
                warranty: "12 tháng",
                seoTitle: "Máy xay sinh tố - Đa năng",
                seoDescription: "Máy xay sinh tố đa năng công suất cao, dễ sử dụng.",
                seoUrl: "may-xay-sinh-to",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Phụ Kiện & Trang Sức Nữ
            {
                name: "Vòng tay bạc",
                description: "Vòng tay bạc 925 đính đá",
                price: 39.99,
                stock: 70,
                imageUrl: "https://example.com/vong-tay-bac.jpg",
                categoryId: createdCategories.get("Phụ Kiện & Trang Sức Nữ"),
                viewCount: 1300,
                soldCount: 65,
                rating: 4.6,
                status: "ACTIVE",
                sku: "PKN-VTB001",
                barcode: "678901234567",
                weight: 0.1,
                dimensions: "6.5",
                material: "Bạc",
                origin: "Thái Lan",
                warranty: "Không có",
                seoTitle: "Vòng tay bạc - Đính đá",
                seoDescription: "Vòng tay bạc 925 đính đá, thời trang, dễ mặc.",
                seoUrl: "vong-tay-bac",
                isFeatured: false,
                isNew: true,
                isBestSeller: false
            },
            // Thể Thao & Du Lịch
            {
                name: "Balo du lịch",
                description: "Balo du lịch chống nước 30L",
                price: 49.99,
                stock: 40,
                imageUrl: "https://example.com/balo-du-lich.jpg",
                categoryId: createdCategories.get("Thể Thao & Du Lịch"),
                viewCount: 1500,
                soldCount: 50,
                rating: 4.7,
                status: "ACTIVE",
                sku: "TTD-BDL001",
                barcode: "789012345678",
                weight: 0.8,
                dimensions: "50x30x20 cm",
                material: "Vải",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Balo du lịch - Chống nước",
                seoDescription: "Balo du lịch chống nước 30L, thời trang, dễ mặc.",
                seoUrl: "balo-du-lich",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Bách Hóa Online
            {
                name: "Khẩu trang y tế",
                description: "Khẩu trang y tế 3 lớp 50 cái",
                price: 9.99,
                stock: 500,
                imageUrl: "https://example.com/khau-trang.jpg",
                categoryId: createdCategories.get("Bách Hóa Online"),
                viewCount: 3000,
                soldCount: 400,
                rating: 4.8,
                status: "ACTIVE",
                sku: "BHO-KTY001",
                barcode: "890123456789",
                weight: 0.1,
                dimensions: "17.5x9.5 cm",
                material: "Vải",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Khẩu trang y tế - 3 lớp",
                seoDescription: "Khẩu trang y tế 3 lớp 50 cái, bảo vệ sức khỏe.",
                seoUrl: "khau-trang-y-te",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Ô Tô & Xe Máy & Xe Đạp
            {
                name: "Mũ bảo hiểm",
                description: "Mũ bảo hiểm xe máy đạt chuẩn",
                price: 29.99,
                stock: 100,
                imageUrl: "https://example.com/mu-bao-hiem.jpg",
                categoryId: createdCategories.get("Ô Tô & Xe Máy & Xe Đạp"),
                viewCount: 1800,
                soldCount: 120,
                rating: 4.6,
                status: "ACTIVE",
                sku: "OTX-MBH001",
                barcode: "901234567890",
                weight: 0.5,
                dimensions: "M",
                material: "Nhựa",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Mũ bảo hiểm - Đạt chuẩn",
                seoDescription: "Mũ bảo hiểm xe máy đạt chuẩn, an toàn, dễ mặc.",
                seoUrl: "mu-bao-hiem",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Nhà Sách Online
            {
                name: "Sách dạy nấu ăn",
                description: "Sách dạy nấu ăn 100 món ngon",
                price: 24.99,
                stock: 80,
                imageUrl: "https://example.com/sach-nau-an.jpg",
                categoryId: createdCategories.get("Nhà Sách Online"),
                viewCount: 1200,
                soldCount: 70,
                rating: 4.7,
                status: "ACTIVE",
                sku: "NSO-SNA001",
                barcode: "012345678901",
                weight: 0.3,
                dimensions: "20x15x2 cm",
                material: "Giấy",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Sách dạy nấu ăn - 100 món ngon",
                seoDescription: "Sách dạy nấu ăn 100 món ngon, dễ hiểu, dễ làm.",
                seoUrl: "sach-day-nau-an",
                isFeatured: false,
                isNew: true,
                isBestSeller: false
            },
            // Balo & Túi Ví Nam
            {
                name: "Balo laptop nam",
                description: "Balo laptop chống nước 15.6 inch",
                price: 59.99,
                stock: 45,
                imageUrl: "https://example.com/balo-laptop-nam.jpg",
                categoryId: createdCategories.get("Balo & Túi Ví Nam"),
                viewCount: 1600,
                soldCount: 55,
                rating: 4.6,
                status: "ACTIVE",
                sku: "BTVN-BL001",
                barcode: "123456789012",
                weight: 0.7,
                dimensions: "40x30x15 cm",
                material: "Vải",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Balo laptop nam - Chống nước",
                seoDescription: "Balo laptop chống nước 15.6 inch, thời trang, dễ mặc.",
                seoUrl: "balo-laptop-nam",
                isFeatured: false,
                isNew: true,
                isBestSeller: false
            },
            // Thời Trang Trẻ Em
            {
                name: "Áo thun trẻ em",
                description: "Áo thun cotton 100% cho bé",
                price: 199000,
                stock: 120,
                imageUrl: "https://example.com/ao-thun-tre-em.jpg",
                categoryId: createdCategories.get("Thời Trang Trẻ Em"),
                viewCount: 1400,
                soldCount: 90,
                rating: 4.7,
                status: "ACTIVE",
                sku: "TTTE-AT001",
                barcode: "234567890123",
                weight: 0.1,
                dimensions: "S",
                material: "Cotton",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Áo thun trẻ em - Cotton 100%",
                seoDescription: "Áo thun cotton 100% cho bé, thoáng mát, dễ mặc.",
                seoUrl: "ao-thun-tre-em",
                isFeatured: false,
                isNew: true,
                isBestSeller: true
            },
            // Đồ Chơi
            {
                name: "Lego Star Wars",
                description: "Bộ xếp hình Lego Star Wars",
                price: 799000,
                stock: 30,
                imageUrl: "https://example.com/lego-star-wars.jpg",
                categoryId: createdCategories.get("Đồ Chơi"),
                viewCount: 2000,
                soldCount: 40,
                rating: 4.8,
                status: "ACTIVE",
                sku: "DC-LSW001",
                barcode: "345678901234",
                weight: 0.5,
                dimensions: "30x20x10 cm",
                material: "Nhựa",
                origin: "Đan Mạch",
                warranty: "Không có",
                seoTitle: "Lego Star Wars - Bộ xếp hình",
                seoDescription: "Bộ xếp hình Lego Star Wars, thú vị, dễ chơi.",
                seoUrl: "bo-xep-hinh-lego-star-wars",
                isFeatured: false,
                isNew: true,
                isBestSeller: true
            },
            // Giặt Giũ & Chăm Sóc Nhà Cửa
            {
                name: "Nước giặt xả",
                description: "Nước giặt xả 3.8L",
                price: 14.99,
                stock: 200,
                imageUrl: "https://example.com/nuoc-giat-xa.jpg",
                categoryId: createdCategories.get("Giặt Giũ & Chăm Sóc Nhà Cửa"),
                viewCount: 2500,
                soldCount: 180,
                rating: 4.6,
                status: "ACTIVE",
                sku: "GSCN-NGX001",
                barcode: "456789012345",
                weight: 3.8,
                dimensions: "20x10x10 cm",
                material: "Lỏng",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Nước giặt xả - 3.8L",
                seoDescription: "Nước giặt xả 3.8L, thơm mát, dễ sử dụng.",
                seoUrl: "nuoc-giat-xa",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Chăm Sóc Thú Cưng
            {
                name: "Thức ăn cho chó",
                description: "Thức ăn hạt cho chó 5kg",
                price: 29.99,
                stock: 100,
                imageUrl: "https://example.com/thuc-an-cho-cho.jpg",
                categoryId: createdCategories.get("Chăm Sóc Thú Cưng"),
                viewCount: 1500,
                soldCount: 80,
                rating: 4.7,
                status: "ACTIVE",
                sku: "CSTC-TAC001",
                barcode: "567890123456",
                weight: 5.0,
                dimensions: "30x20x10 cm",
                material: "Hạt",
                origin: "Thái Lan",
                warranty: "Không có",
                seoTitle: "Thức ăn cho chó - 5kg",
                seoDescription: "Thức ăn hạt cho chó 5kg, dinh dưỡng, dễ ăn.",
                seoUrl: "thuc-an-cho-cho",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            },
            // Voucher & Dịch Vụ
            {
                name: "Voucher spa",
                description: "Voucher massage body 60 phút",
                price: 49.99,
                stock: 50,
                imageUrl: "https://example.com/voucher-spa.jpg",
                categoryId: createdCategories.get("Voucher & Dịch Vụ"),
                viewCount: 900,
                soldCount: 40,
                rating: 4.8,
                status: "ACTIVE",
                sku: "VDV-SPA001",
                barcode: "678901234567",
                weight: 0.0,
                dimensions: "Không có",
                material: "Giấy",
                origin: "Việt Nam",
                warranty: "Không có",
                seoTitle: "Voucher spa - Massage body",
                seoDescription: "Voucher massage body 60 phút, thư giãn, dễ sử dụng.",
                seoUrl: "voucher-spa",
                isFeatured: false,
                isNew: true,
                isBestSeller: false
            },
            // Dụng cụ và thiết bị tiện ích
            {
                name: "Bộ dụng cụ sửa chữa",
                description: "Bộ dụng cụ đa năng 100 món",
                price: 39.99,
                stock: 60,
                imageUrl: "https://example.com/bo-dung-cu.jpg",
                categoryId: createdCategories.get("Dụng cụ và thiết bị tiện ích"),
                viewCount: 1100,
                soldCount: 45,
                rating: 4.6,
                status: "ACTIVE",
                sku: "DCTB-BDC001",
                barcode: "789012345678",
                weight: 2.0,
                dimensions: "40x30x10 cm",
                material: "Kim loại",
                origin: "Trung Quốc",
                warranty: "Không có",
                seoTitle: "Bộ dụng cụ sửa chữa - Đa năng",
                seoDescription: "Bộ dụng cụ đa năng 100 món, tiện lợi, dễ sử dụng.",
                seoUrl: "bo-dung-cu-sua-chua",
                isFeatured: false,
                isNew: false,
                isBestSeller: true
            }
        ];

        // Create products with retry logic
        for (const product of products) {
            if (product.categoryId) {
                try {
                    await prisma.product.upsert({
                        where: { id: product.id || 0 },
                        update: {
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            stock: product.stock,
                            imageUrl: product.imageUrl,
                            categoryId: product.categoryId,
                            sku: product.sku,
                            barcode: product.barcode,
                            weight: product.weight,
                            dimensions: product.dimensions,
                            material: product.material,
                            origin: product.origin,
                            warranty: product.warranty,
                            seoTitle: product.seoTitle,
                            seoDescription: product.seoDescription,
                            seoUrl: product.seoUrl,
                            isFeatured: product.isFeatured,
                            isNew: product.isNew,
                            isBestSeller: product.isBestSeller
                        },
                        create: {
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            stock: product.stock,
                            imageUrl: product.imageUrl,
                            categoryId: product.categoryId,
                            sku: product.sku,
                            barcode: product.barcode,
                            weight: product.weight,
                            dimensions: product.dimensions,
                            material: product.material,
                            origin: product.origin,
                            warranty: product.warranty,
                            seoTitle: product.seoTitle,
                            seoDescription: product.seoDescription,
                            seoUrl: product.seoUrl,
                            isFeatured: product.isFeatured,
                            isNew: product.isNew,
                            isBestSeller: product.isBestSeller
                        }
                    });
                } catch (error) {
                    console.error(`Error creating product ${product.sku}:`, error);
                }
            }
        }

        console.log('Sample products created successfully');
    } catch (error) {
        console.error('Error in seed:', error);
        throw error;
    }
}

// Add retry logic for database connection
async function seedWithRetry(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            await main();
            break;
        } catch (error) {
            if (i === retries - 1) {
                console.error('Failed to seed database after all retries:', error);
                process.exit(1);
            }
            console.log(`Retry ${i + 1}/${retries} after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

seedWithRetry()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
