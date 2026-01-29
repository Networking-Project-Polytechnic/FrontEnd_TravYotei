"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BusManagement } from "@/components/sections/bus-management"
import { DriverManagement } from "@/components/sections/driver-management"
import { RouteManagement } from "@/components/sections/route-management"
import { FareManagement } from "@/components/sections/fare-management"
import { TripManagement } from "@/components/sections/trip-management"
import { DriverAssignment } from "@/components/sections/driver-assignment"
import { LocationManagement } from "@/components/sections/location-management"
import { BusParameters } from "@/components/sections/bus-parameters"

type Section = "buses" | "drivers" | "locations" | "routes" | "fares" | "trips" | "assignments" | "parameters"

export default function AgencyDashboardPage() {
    const params = useParams()
    const agencyId = params.agencyId as string
    console.log("Dashboard Page params:", params, "Extracted agencyId:", agencyId);
    const [activeSection, setActiveSection] = useState<Section>("buses")

    return (
        <div className="flex h-screen bg-background">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-muted-foreground">
                            Agency ID: <span className="text-foreground font-mono">{agencyId}</span>
                        </h1>
                    </div>

                    {activeSection === "buses" && <BusManagement agencyId={agencyId} />}
                    {activeSection === "drivers" && <DriverManagement agencyId={agencyId} />}
                    {activeSection === "locations" && <LocationManagement agencyId={agencyId} />}
                    {activeSection === "routes" && <RouteManagement agencyId={agencyId} />}
                    {activeSection === "fares" && <FareManagement agencyId={agencyId} />}
                    {activeSection === "trips" && <TripManagement agencyId={agencyId} />}
                    {activeSection === "assignments" && <DriverAssignment agencyId={agencyId} />}
                    {activeSection === "parameters" && <BusParameters agencyId={agencyId} />}
                </div>
            </main>
        </div>
    )
}
