import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const role = req.auth?.user?.role

    // Redirect authenticated users away from signin page
    if (nextUrl.pathname === "/auth/signin" && isLoggedIn) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", nextUrl))
        if (role === "WRITER") return NextResponse.redirect(new URL("/writer", nextUrl))
        return NextResponse.redirect(new URL("/", nextUrl))
    }

    if (nextUrl.pathname.startsWith("/admin")) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/signin", nextUrl))
        if (role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl))
    }

    if (nextUrl.pathname.startsWith("/writer")) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/signin", nextUrl))
        if (role !== "ADMIN" && role !== "WRITER") return NextResponse.redirect(new URL("/", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
