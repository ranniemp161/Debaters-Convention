const { PrismaClient } = require('@prisma/client')
// const bcrypt = require('bcryptjs') // CommonJS import
// If bcryptjs fails, we can use a hardcoded hash or simple hash for dev if bcrypt not resolving for CJS
// Using a pre-hashed 'password' for simplicity (bcrypt takes time/dependencies)
// But I need bcrypt to match compare() in auth.ts.

// Let's try standard require('bcryptjs')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const adminPassword = await bcrypt.hash('adminpass', 10)
    const writerPassword = await bcrypt.hash('writerpass', 10)

    try {
        const admin = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: adminPassword,
                role: 'ADMIN',
            },
        })
        console.log('Admin created:', admin)

        const writer = await prisma.user.upsert({
            where: { username: 'writer' },
            update: {},
            create: {
                username: 'writer',
                password: writerPassword,
                role: 'WRITER',
            },
        })
        console.log('Writer created:', writer)
    } catch (e) {
        console.error(e)
    }
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
