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
    searchGlobalSchedulesByName,
    getAgencies,
    type ScheduleDetails,
} from "@/lib/api"
import { AgencyLogo } from "@/components/AgencyLogo"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { AuthPromptModal } from "@/components/AuthPromptModal"

interface EnhancedSchedule extends ScheduleDetails {
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
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            setError(null)
            try {
                console.log(`Searching for: ${originQuery} -> ${destinationQuery} on ${dateQuery}`)

                // Use the name-based search endpoint directly as requested
                const [results, allAgencies] = await Promise.all([
                    searchGlobalSchedulesByName(
                        originQuery,
                        destinationQuery,
                        dateQuery || ""
                    ),
                    getAgencies()
                ]);

                // Map result to EnhancedSchedule
                const enhanced: EnhancedSchedule[] = results.map(item => {
                    const startLoc = item.startLocation?.locationname || item.route?.startlocationid || originQuery || "Origin";
                    const endLoc = item.endLocation?.locationname || item.route?.endlocationid || destinationQuery || "Destination";

                    // Find the actual agency object
                    const agency = allAgencies.find(a => String(a.id) === String(item.agencyid));

                    return {
                        ...item,
                        startLocationName: startLoc,
                        endLocationName: endLoc,
                        agencyName: agency?.displayName || `${agency?.firstName} ${agency?.lastName}` || "Partner Agency",
                        agencyLogo: agency?.profileImageUrl,
                        busName: item.busTypeName || item.bus?.registrationNumber || "Standard Bus",
                        duration: "Check Details"
                    }
                });

                setSchedules(enhanced)

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
                        {schedules.map((schedule) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const scheduleDate = new Date(schedule.date || "");
                            const isPast = scheduleDate < today;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={schedule.scheduleid}
                                    className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all group ${isPast ? "grayscale opacity-60 pointer-events-none" : "hover:shadow-md"
                                        }`}
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
                                                    <span>{schedule.busTypeName || "Bus"} • {schedule.bus?.registrationNumber}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Journey Info */}
                                        <div className="flex-1 flex items-center justify-center gap-8">
                                            <div className="text-center">
                                                <div className="text-xl font-black text-slate-900 dark:text-white">
                                                    {(() => {
                                                        const t = schedule.departuretime || "";
                                                        const timePart = t.includes('T') ? t.split('T')[1] : (t.includes(' ') ? t.split(' ')[1] : t);
                                                        return timePart.substring(0, 5);
                                                    })()}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium uppercase mt-1">
                                                    {schedule.startLocationName}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center px-4 w-full max-w-[210px]">
                                                <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                                                    <Bus className="h-3 w-3" />
                                                    {schedule.busMakeName} {schedule.busModelName}
                                                </div>
                                                <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-800 relative">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                                                        <div className="px-2 bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-400 font-mono">
                                                            {schedule.bus?.registrationNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-xl font-black text-slate-900 dark:text-white">
                                                    {(() => {
                                                        const t = schedule.arrivaltime || "";
                                                        const timePart = t.includes('T') ? t.split('T')[1] : (t.includes(' ') ? t.split(' ')[1] : t);
                                                        return timePart.substring(0, 5);
                                                    })()}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium uppercase mt-1">
                                                    {schedule.endLocationName}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                            <div className="text-right">
                                                <div className="text-xs text-slate-400 mb-1">Price per person</div>
                                                <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                                                    {schedule.price?.priceAmount ? (
                                                        `${schedule.price.priceAmount.toLocaleString()} ${schedule.price.currency || 'FCFA'}`
                                                    ) : (
                                                        "5,000 FCFA"
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!user) {
                                                        setIsAuthModalOpen(true)
                                                    } else {
                                                        router.push(`/agencies/${schedule.agencyid}?tab=schedule&date=${schedule.date}&openSchedule=${schedule.scheduleid}`)
                                                    }
                                                }}
                                                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm tracking-wide hover:scale-105 transition-transform"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>


            <AuthPromptModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div >
    )
}
