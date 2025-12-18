import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    const adminPassword = await bcrypt.hash('adminpass', 10)
    const writerPassword = await bcrypt.hash('writerpass', 10)

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    const writer = await prisma.user.upsert({
        where: { username: 'writer' },
        update: {},
        create: {
            username: 'writer',
            password: writerPassword,
            role: 'WRITER',
        },
    })

    console.log({ admin, writer })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
