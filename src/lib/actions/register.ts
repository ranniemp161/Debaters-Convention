"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegisterState = {
    error?: {
        name?: string[]
        username?: string[]
        password?: string[]
        confirmPassword?: string[]
        _form?: string[]
    }
}

export async function registerUser(prevState: RegisterState | undefined, formData: FormData): Promise<RegisterState> {
    const data = Object.fromEntries(formData.entries())

    const validation = registerSchema.safeParse(data)

    if (!validation.success) {
        return {
            error: validation.error.flatten().fieldErrors as RegisterState['error'],
        }
    }

    const { name, username, password } = validation.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return {
                error: {
                    username: ["Username already exists"],
                },
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                role: "WRITER",
            },
        })

    } catch (error) {
        console.error("Registration error:", error)
        return {
            error: {
                _form: ["Something went wrong. Please try again."],
            },
        }
    }

    redirect("/auth/signin")
}
