import { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export const metadata = {
  title: "Admin Portal - TravYotei",
  description: "Portail d'administration TravYotei",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fixe à gauche */}
      <AdminSidebar />
      
      {/* Zone de contenu principale */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
