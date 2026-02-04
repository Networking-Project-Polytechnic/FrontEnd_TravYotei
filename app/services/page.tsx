"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Navigation,
    Search,
    MapPin,
    Users,
    ShieldCheck,
    Clock,
    Globe,
    BadgeCheck,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
    {
        title: "Agency Search",
        description: "Find and compare top-rated travel agencies across Cameroon based on price, comfort, and reviews.",
        icon: Search,
        color: "cyan"
    },
    {
        title: "Online Booking",
        description: "Reserve your seats instantly through our secure platform with multiple payment options.",
        icon: Navigation,
        color: "blue"
    },
    {
        title: "Real-time Tracking",
        description: "Track your bus's live location and estimated time of arrival using integrated GPS data.",
        icon: MapPin,
        color: "indigo"
    },
    {
        title: "Agency Management",
        description: "Tools for agencies to manage fleets, routes, and bookings in a single, powerful dashboard.",
        icon: ShieldCheck,
        color: "purple"
    },
    {
        title: "24/7 Support",
        description: "Dedicated support team to assist you with bookings, cancellations, or any travel issues.",
        icon: Clock,
        color: "pink"
    },
    {
        title: "Nationwide Coverage",
        description: "A growing network of partners connecting all major cities and regions in Cameroon.",
        icon: Globe,
        color: "emerald"
    }
]

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-bold uppercase tracking-widest mb-6"
                    >
                        Our Services
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight"
                    >
                        Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Travel</span> in Cameroon
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 dark:text-slate-400 text-lg"
                    >
                        Travyotei provides a comprehensive ecosystem for both travelers and agencies,
                        making public transport more transparent, efficient, and safer.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-cyan-500/50 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                <service.icon className={`h-6 w-6 text-${service.color}-500`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                {service.description}
                            </p>
                            <Link href="/agencies" className="text-sm font-bold text-cyan-500 flex items-center group-hover:gap-2 transition-all">
                                Learn More <ChevronRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[40px] overflow-hidden bg-slate-900 p-12 text-center"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase">Ready to Start Your Journey?</h2>
                        <p className="text-slate-400 mb-10">Join thousands of travelers who trust Travyotei for their daily commutes and seasonal travels.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/agencies">
                                <Button className="w-full sm:w-auto h-14 px-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                                    Find an Agency
                                </Button>
                            </Link>
                            <Link href="/client-join">
                                <Button variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-2xl border-slate-700 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
