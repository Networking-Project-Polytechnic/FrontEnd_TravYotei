"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Search,
    MapPin,
    Calendar,
    Bus,
    Clock,
    ArrowRight,
    AlertCircle,
    Filter
} from "lucide-react"
import NavBar from "@/components/Navbar2"
import {
    getLocationByName,
    getRoutesByLocations,
    getRoutes,
    getSchedulesByAgency,
    getAgencies,
    getBusById,
    type Schedule,
    type Route,
    type Location,
    type Agency,
    type Bus as BusType
} from "@/lib/api"
import { AgencyLogo } from "@/components/AgencyLogo"
import Link from "next/link"

interface EnhancedSchedule extends Schedule {
    startLocationName?: string;
    endLocationName?: string;
    agencyName?: string;
    agencyLogo?: string;
    busName?: string; // combination of make/model
    duration?: string;
}

export default function SearchContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const originQuery = searchParams.get("origin") || ""
    const destinationQuery = searchParams.get("destination") || ""
    const dateQuery = searchParams.get("date") || ""

    const [schedules, setSchedules] = useState<EnhancedSchedule[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            setError(null)
            try {
                console.log(`Searching for: ${originQuery} -> ${destinationQuery} on ${dateQuery}`)

                // 1. Resolve Locations
                const [originLoc, destLoc] = await Promise.all([
                    originQuery ? getLocationByName(originQuery) : Promise.resolve(null),
                    destinationQuery ? getLocationByName(destinationQuery) : Promise.resolve(null)
                ])

                if (originQuery && !originLoc) console.warn(`Could not resolve origin: ${originQuery}`)
                if (destinationQuery && !destLoc) console.warn(`Could not resolve destination: ${destinationQuery}`)

                // 2. Resolve Routes
                // If we have precise locations, we filter routes by IDs.
                // If not, we might filter by location name matching (less precise but helpful backup logic if DB names differ slightly)
                let allRoutes: Route[] = []
                try {
                    let routesData: any
                    if (originLoc?.locationid && destLoc?.locationid) {
                        routesData = await getRoutesByLocations(originLoc.locationid, destLoc.locationid)
                    } else {
                        routesData = await getRoutes()
                    }

                    if (Array.isArray(routesData)) {
                        allRoutes = routesData
                    } else {
                        console.warn("API returned non-array for routes:", routesData)
                        allRoutes = []
                    }
                } catch (err) {
                    console.warn("Error fetching routes:", err)
                    allRoutes = []
                }

                const matchingRoutes = allRoutes.filter(route => {
                    // If we have IDs:
                    if (originLoc && route.startlocationid !== originLoc.locationid) return false
                    if (destLoc && route.endlocationid !== destLoc.locationid) return false

                    return true
                })

                if (matchingRoutes.length === 0) {
                    setSchedules([])
                    setLoading(false)
                    return
                }

                // 3. Fetch Schedules from Agencies found in routes
                // The user logic: Get routes -> Get Agency IDs -> Get Schedules for those Agencies -> Filter by Date

                const allSchedules: EnhancedSchedule[] = []
                const agencies = await getAgencies()

                // Get unique agency IDs from the matching routes
                const agencyIds = Array.from(new Set(matchingRoutes.map(r => r.agencyid)))

                for (const agencyId of agencyIds) {
                    try {
                        const agencySchedules = await getSchedulesByAgency(agencyId)

                        // Filter by Date (String comparison) and ensure route matches
                        const relevantSchedules = agencySchedules.filter(sched => {
                            const dateMatches = dateQuery ? sched.date === dateQuery : true
                            const routeMatches = matchingRoutes.some(r => r.routeid === sched.routeid)
                            return dateMatches && routeMatches
                        })

                        // Enhance them
                        for (const sched of relevantSchedules) {
                            const agency = agencies.find(a => a.id === sched.agencyid)

                            allSchedules.push({
                                ...sched,
                                startLocationName: originLoc ? originLoc.locationname : "Origin",
                                endLocationName: destLoc ? destLoc.locationname : "Destination",
                                agencyName: agency?.displayName || `${agency?.firstName} ${agency?.lastName}` || "Unknown Agency",
                                agencyLogo: agency?.profileImageUrl,
                                duration: "Check Details"
                            })
                        }

                    } catch (err) {
                        console.error(`Error fetching schedules for agency ${agencyId}`, err)
                    }
                }

                setSchedules(allSchedules)

            } catch (err) {
                console.error("Search error:", err)
                setError("An error occurred while searching. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [originQuery, destinationQuery, dateQuery])

    const handleNewSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Logic to update URL params handled by the inputs and state if we want to make the top bar functional
        // For now we just display results
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Search Header */}
            <div className="bg-slate-900 pt-28 pb-10 px-4 text-center">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Trip Results
                    </h1>
                    <div className="inline-flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 text-slate-300 text-sm">
                        <span className="font-medium text-white">{originQuery || "Anywhere"}</span>
                        <ArrowRight className="h-4 w-4 mx-3 text-cyan-500" />
                        <span className="font-medium text-white">{destinationQuery || "Anywhere"}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-600 mx-3"></div>
                        <Calendar className="h-3.5 w-3.5 mr-2 text-cyan-500" />
                        <span>{dateQuery || "Any Date"}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                        <p className="text-slate-500">Searching specifically for the best routes...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-slate-500 mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-cyan-500 underline">Try Again</button>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No trips found</h3>
                        <p className="text-slate-500 max-w-md">
                            We couldn't find any schedules matching your criteria. Try changing the date or searching for major cities.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {schedules.map((schedule) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={schedule.scheduleid}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    {/* Agency Info */}
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <AgencyLogo
                                            agencyName={schedule.agencyName || "Agency"}
                                            profileImageUrl={schedule.agencyLogo}
                                            className="w-12 h-12 rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{schedule.agencyName}</h3>
                                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                                <Bus className="h-3 w-3 mr-1" />
                                                <span>Standard Bus</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Journey Info */}
                                    <div className="flex-1 flex items-center justify-center gap-8">
                                        <div className="text-center">
                                            <div className="text-xl font-black text-slate-900 dark:text-white">{schedule.departuretime}</div>
                                            <div className="text-xs text-slate-500 font-medium uppercase mt-1">{schedule.startLocationName}</div>
                                        </div>

                                        <div className="flex flex-col items-center px-4 w-full max-w-[200px]">
                                            <div className="text-[10px] text-slate-400 mb-1">{schedule.duration}</div>
                                            <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-800 relative">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-xl font-black text-slate-900 dark:text-white">{schedule.arrivaltime}</div>
                                            <div className="text-xs text-slate-500 font-medium uppercase mt-1">{schedule.endLocationName}</div>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400 mb-1">Price per person</div>
                                            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                                                {/* Placeholder price if not in schedule object, though real app should have it */}
                                                5,000 FCFA
                                            </div>
                                        </div>
                                        <Link href={`/client-join`}>
                                            {/* Ideally links to booking flow */}
                                            <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm tracking-wide hover:scale-105 transition-transform">
                                                Select
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
