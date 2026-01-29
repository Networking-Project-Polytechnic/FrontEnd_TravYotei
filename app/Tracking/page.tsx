'use client'; // Add this at the top

import React from 'react';

const TrackingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                    {/* Icon Container with Gradient */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-12 w-12"
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                                Tracking
                            </h1>
                            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>
                        
                        <p className="text-xl text-gray-600 font-medium leading-relaxed">
                            We're crafting something special
                        </p>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Feature Available Soon
                            </span>
                        </div>

                        {/* Subtle Description */}
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Real-time tracking, delivery notifications, and shipment analytics 
                            are coming your way. Stay tuned for updates!
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <div className="flex justify-center space-x-3">
                            {[...Array(3)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="h-2 w-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Elements for Visual Interest */}
                <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default TrackingPage;