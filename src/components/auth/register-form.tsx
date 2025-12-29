'use client'

import { useActionState } from 'react'
import { registerUser, type RegisterState } from '@/lib/actions/register'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'

export function RegisterForm() {
    const initialState: RegisterState = {}
    const [state, formAction, isPending] = useActionState(registerUser, initialState)

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>
                    Create an account to start writing
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                        />
                        {state?.error?.name && (
                            <p className="text-sm text-red-500">{state.error.name}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="johndoe"
                            required
                        />
                        {state?.error?.username && (
                            <p className="text-sm text-red-500">{state.error.username}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" name="password" required />
                        {state?.error?.password && (
                            <p className="text-sm text-red-500">{state.error.password}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" name="confirmPassword" required />
                        {state?.error?.confirmPassword && (
                            <p className="text-sm text-red-500">{state.error.confirmPassword}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Register
                    </Button>
                    {state?.error?._form && (
                        <p className="text-sm text-red-500">{state.error._form}</p>
                    )}
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="underline">
                            Login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
