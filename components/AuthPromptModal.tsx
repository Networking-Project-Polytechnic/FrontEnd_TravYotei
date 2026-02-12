'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthPromptModal({ isOpen, onClose }: AuthPromptModalProps) {
    const [selectedRole, setSelectedRole] = useState<'client' | 'agency'>('client');
    const router = useRouter();

    if (!isOpen) return null;

    const handleLogin = () => {
        const path = selectedRole === 'client' ? '/client-join?mode=login' : '/agency-join?mode=login';
        router.push(path);
    };

    const handleSignup = () => {
        const path = selectedRole === 'client' ? '/client-join?mode=signup' : '/agency-join?mode=signup';
        router.push(path);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden border border-slate-200 dark:border-slate-800 relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8">
                                <div className="text-center mb-8 mt-2">
                                    <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                                        <LogIn className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                        Unlock Full Access
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Signup now to view full details and book your trips instantly.
                                    </p>
                                </div>

                                {/* Role Toggle */}
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-8">
                                    <button
                                        onClick={() => setSelectedRole('client')}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${selectedRole === 'client'
                                                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Traveler
                                    </button>
                                    <button
                                        onClick={() => setSelectedRole('agency')}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${selectedRole === 'agency'
                                                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Agency
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleLogin}
                                        className="w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/10 dark:shadow-white/5"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={handleSignup}
                                        className="w-full py-4 px-6 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold rounded-xl hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors border border-cyan-100 dark:border-cyan-800/30"
                                    >
                                        Create Account
                                    </button>
                                </div>

                                <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <button
                                        onClick={onClose}
                                        className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-wider"
                                    >
                                        Sign up later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
