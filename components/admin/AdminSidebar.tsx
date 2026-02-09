"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  CheckCircle, 
  BarChart3, 
  Settings, 
  FileText,
  Home
} from "lucide-react"

type MenuItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Resume",
    icon: Home,
    href: "/admin",
  },
  {
    id: "validation",
    label: "Validation",
    icon: CheckCircle,
    href: "/admin/validation",
  },
  {
    id: "statistics",
    label: "Statistiques",
    icon: BarChart3,
    href: "/admin/statistics",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    href: "/admin/settings",
  },
  {
    id: "logs",
    label: "Logs",
    icon: FileText,
    href: "/admin/logs",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">TravYotei</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
                          (item.href !== "/admin" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Administrateur</p>
            <p className="text-xs text-gray-400">admin@travyotei.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
