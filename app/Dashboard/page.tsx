"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function DashboardRedirect() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push(`/Dashboard/${user.id}`)
    } else if (!loading && !user) {
      // If no user is logged in, the AuthContext should handle redirection to login,
      // but as a fallback, we could redirect to agency-join here.
      router.push("/agency-join?mode=signup")
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Redirecting to agency dashboard...</p>
      </div>
    </div>
  )
}
