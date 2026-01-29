'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Heart,
  ChevronDown,
  User,
  Building2
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                href="/services"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                href="/faqs"
                className="text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                FAQs
              </Link>
              <Link
                href="/contact"
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

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer hidden md:flex items-center px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <span>Let&apos;s know more about you</span>
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
            <Link href="/services" className="text-gray-700 dark:text-slate-300 hover:text-cyan-600">Services</Link>
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