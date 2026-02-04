"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Plus,
    Minus,
    MessageSquare,
    HelpCircle
} from "lucide-react"
import { useState } from "react"

const faqs = [
    {
        question: "How do I book a ticket on Travyotei?",
        answer: "Booking is simple: Browse our partner agencies, select your preferred route and time, choose your seat, and complete the payment. You'll receive your ticket instantly."
    },
    {
        question: "How can I track my bus in real-time?",
        answer: "Once your journey has started, you can go to your 'Current Trips' in your dashboard and click the tracking link to see the live location of your bus on the map."
    },
    {
        question: "What if I need to cancel my booking?",
        answer: "Cancellations are subject to the specific agency's policy. Generally, you can cancel up to 24 hours before departure for a full refund through your traveler dashboard."
    },
    {
        question: "How do I become a partner agency?",
        answer: "Visit the 'Agency Console' link in the workspace menu and follow the signup process. Our team will review your credentials and verify your fleet to get you started."
    }
]

export default function ContactFAQPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Contact Info Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
                            Contact Us
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Touch</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
                            Have questions or need assistance? Our team is here to help you with your journey.
                            Reach out through any of the channels below.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: "Email", info: "travyoteiteam4gi@travyotei.com" },
                                { icon: Phone, label: "Phone Number", info: "681154869" },
                                { icon: MapPin, label: "Address", info: "Melen, Yaoundé, Cameroon" },
                                { icon: Clock, label: "Opening Hours", info: "Mon-Fri (8AM to 6PM)" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mr-6">
                                        <item.icon className="h-6 w-6 text-cyan-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className="text-slate-900 dark:text-white font-bold">{item.info}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right side contact form decoration or image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:flex items-center justify-center"
                    >
                        <div className="relative w-full aspect-square rounded-[60px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.1),transparent)] flex items-center justify-center">
                                <MessageSquare className="h-64 w-64 text-slate-300 dark:text-slate-800 rotate-12" />
                            </div>
                            <div className="relative z-10 text-center p-12">
                                <div className="text-6xl font-black text-slate-400/20 mb-4 uppercase italic">Support</div>
                                <div className="text-6xl font-black text-slate-400/20 mb-4 uppercase italic ml-12">Travel</div>
                                <div className="text-6xl font-black text-slate-400/20 mb-4 uppercase italic ml-24">Booking</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* FAQs Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest mb-6">
                            Frequently Asked Questions
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Wait, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">I have questions</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">{faq.question}</span>
                                    {openFaq === index ? (
                                        <Minus className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                    )}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: openFaq === index ? "auto" : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-8 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center p-12 rounded-[40px] bg-cyan-500/5 border border-cyan-500/10">
                        <HelpCircle className="h-12 w-12 text-cyan-500 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Still need help?</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                            Our support team is available during opening hours to help you with any specific issues or questions.
                        </p>
                        <a
                            href="mailto:travyoteiteam4gi@travyotei.com"
                            className="inline-flex h-14 px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all items-center"
                        >
                            Contact Support Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
