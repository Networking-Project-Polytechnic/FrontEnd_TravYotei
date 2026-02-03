'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Navigation,
  ChevronDown,
  User,
  Building2,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const getDashboardLink = () => {
    console.log('🔍 getDashboardLink - User:', user);
    if (!user) return '/client-join';

    // Normalize role to uppercase for robust comparison
    const role = user.role?.toUpperCase();
    console.log('🔍 getDashboardLink - Normalized Role:', role);

    switch (role) {
      case 'CLIENT':
      case 'ROLE_CLIENT':
        return '/userDashboard';
      case 'AGENCY':
      case 'ROLE_AGENCY':
        return '/Dashboard';
      case 'ADMIN':
      case 'ROLE_ADMIN':
        return '/admin-dashboard';
      default:
        console.warn('⚠️ Unknown user role, defaulting to login:', user.role);
        return '/client-join';
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Travyotei
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                href="/"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/agencies"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                Agencies
              </Link>
              <Link
                href="/"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                href="/"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                FAQs
              </Link>
              <Link
                href="/"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Saved Button */}
            {/* <button className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-cyan-600 transition-colors">
              <Heart className="h-5 w-5" />
              <span>Saved</span>
            </button> */}

            <ThemeToggle />

            {/* Dropdown Menu / Profile */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer hidden md:flex items-center px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{user.firstName || user.userName}</span>
                  </div>
                ) : (
                  <span>Let&apos;s know more about you</span>
                )}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden"
                    >
                      <div className="p-3">
                        {user ? (
                          <>
                            <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 border-b border-gray-50 dark:border-slate-800 mb-2">
                              My Account
                            </div>

                            {/* Profile Dashboard Link */}
                            <Link
                              href={getDashboardLink()}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">Go to Dashboard</div>
                                <div className="text-[10px] text-cyan-100">Manage your account</div>
                              </div>
                            </Link>

                            {/* Logout Option */}
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all mt-1"
                            >
                              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mr-4">
                                <LogOut className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-bold text-sm">Logout</div>
                                <div className="text-[10px] text-red-400">Sign out of your account</div>
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 border-b border-gray-50 dark:border-slate-800 mb-2">
                              Choose your workspace
                            </div>

                            {/* Client Option */}
                            <Link
                              href="/client-join"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-4 text-gray-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-all"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 flex items-center justify-center mr-4">
                                <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">Traveler Portal</div>
                                <div className="text-[10px] text-gray-500 dark:text-slate-500">Book trips & tracking</div>
                              </div>
                            </Link>

                            {/* Agency Option */}
                            <Link
                              href="/agency-join"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-4 text-gray-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-all mt-1"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 flex items-center justify-center mr-4">
                                <Building2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">Agency Console</div>
                                <div className="text-[10px] text-gray-500 dark:text-slate-500">Manage fleet & sales</div>
                              </div>
                            </Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="md:hidden flex justify-between items-center py-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-700 dark:text-slate-300 hover:text-cyan-600">Home</Link>
            <Link href="/agencies" className="text-gray-700 dark:text-slate-300 hover:text-cyan-600">Agencies</Link>
            <Link href="/" className="text-gray-700 dark:text-slate-300 hover:text-cyan-600">Services</Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 dark:text-slate-300 hover:text-cyan-600"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}