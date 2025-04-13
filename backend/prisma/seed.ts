import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

    // Create some initial products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Product 1',
                description: 'Description for product 1',
                price: 100,
                stock: 50,
                imageUrl: 'https://example.com/product1.jpg',
                category: 'Category 1'
            }
        }),
        prisma.product.create({
            data: {
                name: 'Product 2',
                description: 'Description for product 2',
                price: 200,
                stock: 30,
                imageUrl: 'https://example.com/product2.jpg',
                category: 'Category 2'
            }
        })
    ]);

    console.log('Initial products created:', products);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 