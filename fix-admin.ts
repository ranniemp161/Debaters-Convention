import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const user = await prisma.user.findUnique({ where: { username: "admin" } })
        if (user) {
            await prisma.user.update({
                where: { username: "admin" },
                data: { name: "Default Admin", role: "ADMIN" }
            })
            console.log("Admin updated successfully")
        } else {
            console.log("Admin user not found to update")
            // Create if not found (though verification said it exists)
            // We won't create here to avoid hash complexity, assuming it exists
        }
    } catch (e) {
        console.error(e)
    }
}

main().finally(() => prisma.$disconnect())
