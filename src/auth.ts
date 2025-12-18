import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string() })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({
                        where: { username },
                    })

                    if (!user) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return {
                        ...user,
                        role: user.role as "ADMIN" | "WRITER"
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token }) {
            if (!token.sub) return token;

            const user = await prisma.user.findUnique({
                where: { id: token.sub }
            })

            if (user) {
                token.role = user.role as "ADMIN" | "WRITER"
                token.username = user.username
            }
            return token
        }
    },
    session: {
        strategy: "jwt",
    },
})
