
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const categories = ["Theology", "Philosophy", "Politics", "Ethics", "Culture"]

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }

    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.upsert({
        where: { username: "admin" },
        update: {
            name: "Default Admin",
            role: "ADMIN",
            password: hashedPassword // ensure password is known
        },
        create: {
            username: "admin",
            name: "Default Admin",
            password: hashedPassword,
            role: "ADMIN"
        }
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
