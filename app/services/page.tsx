import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Services</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-slate-300">
                    We offer a comprehensive platform for travel agencies to manage their fleet, schedules, and bookings efficiently.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">For Travelers</h3>
                        <p className="text-gray-500 dark:text-slate-400">Book tickets easily, track buses in real-time, and manage your travel history.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">For Agencies</h3>
                        <p className="text-gray-500 dark:text-slate-400">Manage your fleet, optimize schedules, and grow your business with our powerful tools.</p>
                    </div>
                </div>

                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
