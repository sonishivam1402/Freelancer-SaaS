"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function AuthPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Freelancer Auto-Reply & Follow-Up</h1>
        <p className="mb-4">Please sign in to access your dashboard.</p>
        <Button onClick={() => signIn("google")}>Sign In with Google</Button>
      </div>
    </div>
  )
}

