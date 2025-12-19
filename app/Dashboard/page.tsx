"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BusManagement } from "@/components/sections/bus-management"
import { DriverManagement } from "@/components/sections/driver-management"
import { RouteManagement } from "@/components/sections/route-management"
import { FareManagement } from "@/components/sections/fare-management"
import { TripManagement } from "@/components/sections/trip-management"
import { DriverAssignment } from "@/components/sections/driver-assignment"
import { LocationManagement } from "@/components/sections/location-management"

type Section = "buses" | "drivers" | "locations" | "routes" | "fares" | "trips" | "assignments"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("buses")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === "buses" && <BusManagement />}
          {activeSection === "drivers" && <DriverManagement />}
          {activeSection === "locations" && <LocationManagement />}
          {activeSection === "routes" && <RouteManagement />}
          {activeSection === "fares" && <FareManagement />}
          {activeSection === "trips" && <TripManagement />}
          {activeSection === "assignments" && <DriverAssignment />}
        </div>
      </main>
    </div>
  )
}
