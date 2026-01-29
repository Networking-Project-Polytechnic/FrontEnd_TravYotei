"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const router = useRouter()
  const defaultAgencyId = "test-agency-id"

  useEffect(() => {
    router.push(`/Dashboard/${defaultAgencyId}`)
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Redirecting to agency dashboard...</p>
      </div>
    </div>
  )
}
