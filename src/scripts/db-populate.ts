import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { id: "1414" },
        update: {},
        create: {
            id: "1414",
            email: "user@example.com",
            name: "User Example",
            image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            role: "user",
        },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
        }
    })

    if (!user) {
        throw new Error('Failed to create or retrieve user.');
    }

    const categories = ['Tech', 'ESG', 'Marketing', 'Business'];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log("Categories seeded successfully!");

    const webinars = [
        {
            id: 'test-11414',
            title: 'Industrial IoT',
            description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            date: new Date('2025-10-15T19:00:00Z'),
            language: 'en',
            duration: 30,
            imageUrl: 'https://images.unsplash.com/photo-1641765170634-4240fede7a17?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            link: 'https://instagram.com',
            category: 'Tech',
            speakerId: user.id,
        },
        {
            id: 'test-23415',
            title: 'Asset Management Strategies',
            description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            date: new Date('2025-11-05T17:00:00Z'),
            language: 'pt',
            duration: 45,
            imageUrl: 'https://images.unsplash.com/photo-1641765170634-4240fede7a17?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            link: 'https://instagram.com',
            category: 'Tech',
            speakerId: user.id,
        },
        {
            id: 'test-23414',
            title: 'Webinar test',
            description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            date: new Date('2025-12-01T16:00:00Z'),
            language: 'en',
            duration: 50,
            imageUrl: 'https://images.unsplash.com/photo-1641765170634-4240fede7a17?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            link: 'https://instagram.com',
            category: 'ESG',
            speakerId: user.id,
        },
    ];

    for (const data of webinars) {
        await prisma.webinar.upsert({ where: { id: data.id }, update: {}, create: data });
    }

    console.log('Webinars seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());