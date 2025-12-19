'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const username = formData.get('username') as string
        const password = formData.get('password') as string
        let redirectUrl = '/' // Default

        if (username) {
            const user = await prisma.user.findUnique({
                where: { username },
                select: { role: true }
            })

            if (user?.role === 'ADMIN') {
                redirectUrl = '/admin'
            } else if (user?.role === 'WRITER') {
                redirectUrl = '/writer'
            }
        }

        await signIn('credentials', { username, password, redirectTo: redirectUrl })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}
