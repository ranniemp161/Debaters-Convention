
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/auth/signin',
    },
    secret: "hardcoded-secret-for-dev",
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as "ADMIN" | "WRITER"
            }
            if (token.username && session.user) {
                session.user.username = token.username as string
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnWriter = nextUrl.pathname.startsWith('/writer')

            if (isOnAdmin) {
                if (isLoggedIn && auth?.user?.role === 'ADMIN') return true
                return false // Redirect to login or home handled by NextAuth or Middleware? 
                // Actually authorized callback is used by middleware 'auth' wrapper
                // If false, it redirects to login. 
                // But specifically for role mismatch, we might want custom redirect.
                // NOTE: My existing middleware logic handled specific redirects.
                // For now, I'll stick to 'true' here to let middleware handle custom logic
                // OR duplicate logic here.
                // The 'auth' wrapper in middleware uses this.
                // Let's implement robust logic here.
                return false
            }

            if (isOnWriter) {
                if (isLoggedIn && (auth?.user?.role === 'WRITER' || auth?.user?.role === 'ADMIN')) return true
                return false
            }

            return true
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
