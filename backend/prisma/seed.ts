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

    // Create sample products
    const products = [
        {
            name: "iPhone 15 Pro Max",
            description: "Apple iPhone 15 Pro Max 256GB - Titanium Blue",
            price: 1299.99,
            stock: 50,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816",
            category: "Smartphone"
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            description: "Samsung Galaxy S24 Ultra 512GB - Titanium Black",
            price: 1199.99,
            stock: 45,
            imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-s24-ultra-s928-sm-s928bzggxxv-thumb-537240000",
            category: "Smartphone"
        },
        {
            name: "MacBook Pro M3",
            description: "Apple MacBook Pro 14-inch M3 Pro chip 18GB RAM 512GB SSD",
            price: 1999.99,
            stock: 30,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m3-max-pro-space-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311053610",
            category: "Laptop"
        },
        {
            name: "Dell XPS 15",
            description: "Dell XPS 15 9530 15.6-inch OLED 3.5K Touch Laptop",
            price: 1799.99,
            stock: 25,
            imageUrl: "https://www.dell.com/en-us/shop/dell-laptops/xps-15-laptop/spd/xps-15-9530-laptop",
            category: "Laptop"
        },
        {
            name: "AirPods Pro 2",
            description: "Apple AirPods Pro (2nd generation) with MagSafe Charging Case",
            price: 249.99,
            stock: 100,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361",
            category: "Accessories"
        },
        {
            name: "Samsung Galaxy Watch 6",
            description: "Samsung Galaxy Watch 6 Classic 47mm Bluetooth",
            price: 399.99,
            stock: 40,
            imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/vn/2307/gallery/vn-galaxy-watch6-classic-r940-sm-r940fzadxxv-thumb-535687000",
            category: "Smartwatch"
        },
        {
            name: "iPad Pro 12.9",
            description: "Apple iPad Pro 12.9-inch (6th generation) M2 chip 256GB",
            price: 1099.99,
            stock: 35,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-11-select-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1664411200794",
            category: "Tablet"
        },
        {
            name: "Samsung Galaxy Tab S9",
            description: "Samsung Galaxy Tab S9 Ultra 14.6-inch 512GB",
            price: 999.99,
            stock: 30,
            imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/vn/2307/gallery/vn-galaxy-tabs9-ultra-wifi-sm-x910nzaaxxv-thumb-535686000",
            category: "Tablet"
        },
        {
            name: "Sony WH-1000XM5",
            description: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
            price: 399.99,
            stock: 60,
            imageUrl: "https://www.sony.com.vn/image/5c1a1a0c0c1a1a0c0c1a1a0c0c1a1a0c",
            category: "Headphones"
        },
        {
            name: "Apple Watch Series 9",
            description: "Apple Watch Series 9 GPS 45mm Aluminum Case",
            price: 429.99,
            stock: 55,
            imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1683224241054",
            category: "Smartwatch"
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product
        });
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
