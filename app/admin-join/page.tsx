'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '../../components/LoginForm';
import AdminSignupForm from '../../components/AdminSignupForm';

function AuthPageContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const [isSignUpMode, setIsSignUpMode] = useState(true);

    useEffect(() => {
        if (mode === 'signup') {
            setIsSignUpMode(true);
        } else if (mode === 'login') {
            setIsSignUpMode(false);
        }
    }, [mode]);

    return (
        <div className="min-h-screen bg-slate-100 font-poppins overflow-hidden">
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                {/* Form container */}
                <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[200px]">

                    {/* Background circle */}
                    <div className={`absolute w-[1100px] h-[1100px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 transition-all duration-700 ease-in-out z-0 ${isSignUpMode
                        ? 'top-0 left-0 -translate-x-1/2 -translate-y-1/2'  // Top-left for Signup (Admin style)
                        : 'top-0 right-0 translate-x-1/2 -translate-y-1/2'   // Top-right for Signin
                        }`}></div>

                    <div className="flex flex-col md:flex-row h-full relative z-10">
                        {/* Forms Container */}
                        <div className="w-full md:w-1/2 p-8 md:p-16 transition-all duration-700 ease-in-out z-20">
                            <div className="w-full h-full grid place-items-center relative">
                                {/* Sign In Form */}
                                <div className={`w-full col-start-1 row-start-1 transition-all duration-700 ease-in-out ${isSignUpMode ? 'opacity-0 pointer-events-none translate-x-[20px]' : 'opacity-100 translate-x-0'
                                    }`}>
                                    <LoginForm switchToSignup={() => setIsSignUpMode(true)} isAdmin={true} />
                                </div>

                                {/* Sign Up Form */}
                                <div className={`w-full col-start-1 row-start-1 transition-all duration-700 ease-in-out ${isSignUpMode ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-[20px]'
                                    }`}>
                                    <AdminSignupForm switchToLogin={() => setIsSignUpMode(false)} />
                                </div>
                            </div>
                        </div>

                        {/* Panels Container */}
                        <div className={`w-full md:w-1/2 relative ${isSignUpMode ? 'md:order-first' : 'md:order-last'}`}>
                            {/* Left Panel */}
                            <div className={`absolute top-0 left-0 w-full h-full p-8 md:p-16 flex flex-col justify-between transition-all duration-700 ease-in-out ${isSignUpMode ? 'md:-translate-x-full opacity-0' : 'opacity-100'
                                }`}>
                                <div className="text-center md:text-right text-white">
                                    <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                                        New <span className="text-cyan-200">Administrator</span>?
                                    </h3>
                                    <p className="mb-2">Manage the platform efficiently.</p>
                                    <p className="mb-6">Join the administration team to oversee operations.</p>
                                    <p className="text-lg font-bold mb-8">Register access</p>
                                    <button
                                        onClick={() => setIsSignUpMode(true)}
                                        className="-mt-1 mb-3 cursor-pointer px-8 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
                                    >
                                        Sign up
                                    </button>
                                </div>
                                <div className="mt-0 md:-mt-8 flex justify-center">
                                    {/* Removed image or verify path */}
                                </div>
                            </div>

                            {/* Right Panel */}
                            <div className={`absolute inset-0 p-8 md:p-16 flex flex-col justify-between items-start transition-all duration-700 ease-in-out ${isSignUpMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}>
                                <div className="text-left text-white max-w-[320px]">
                                    <h3 className="text-2xl md:text-3xl font-semibold mb-4">Admin Login</h3>
                                    <p className="mb-8">Access your dashboard to manage agencies and verify users.</p>
                                    <button
                                        onClick={() => setIsSignUpMode(false)}
                                        className="cursor-pointer hover:text-black px-8 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
                                    >
                                        Sign in
                                    </button>
                                </div>

                                <div className="mt-8 md:mt-0 w-full flex justify-start">
                                    {/* Removed image or verify path */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthPageContent />
        </Suspense>
    );
}
