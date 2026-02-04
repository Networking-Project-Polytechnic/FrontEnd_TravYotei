"use client"

import type React from "react"

import { Bus, Users, RouteIcon, Calendar, UserCheck, DollarSign, MapPin, Settings2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

type Section = "buses" | "drivers" | "locations" | "routes" | "fares" | "trips" | "assignments" | "parameters"

interface SidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

const sections: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "buses", label: "Buses", icon: Bus },
  { id: "drivers", label: "Drivers", icon: Users },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "routes", label: "Routes", icon: RouteIcon },
  { id: "fares", label: "Fares", icon: DollarSign },
  { id: "trips", label: "Trips", icon: Calendar },
  { id: "assignments", label: "Assignments", icon: UserCheck },
  { id: "parameters", label: "Bus Settings", icon: Settings2 },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { logout } = useAuth()

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Transit Hub</h1>
        <p className="text-sm text-white/70 mt-1">Travel Agency Dashboard</p>
      </div>
      <nav className="flex-1 space-y-2 px-4 overflow-y-auto">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${!isActive ? "text-white hover:text-white" : ""}`}
              onClick={() => onSectionChange(section.id)}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </Button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
