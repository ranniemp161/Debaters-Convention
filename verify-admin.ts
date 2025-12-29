import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.findUnique({
        where: { username: 'admin' },
    })
    if (admin && admin.role === 'ADMIN') {
        console.log('Verification Success: Admin user exists.')
        console.log('Admin ID:', admin.id)
        console.log('Admin Name:', admin.name)
    } else {
        console.error('Verification Failed: Admin user not found or incorrect role.')
        process.exit(1)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
