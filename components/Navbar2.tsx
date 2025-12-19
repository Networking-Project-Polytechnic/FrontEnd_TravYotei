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

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
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
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/agencies" 
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                Agencies
              </Link>
              <Link 
                href="/services" 
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                Services
              </Link>
              <Link 
                href="/faqs" 
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                FAQs
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
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

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer hidden md:flex items-center px-4 py-2 text-gray-700 hover:text-cyan-600 transition-colors"
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        Select your role
                      </div>
                      
                      {/* Client Option */}
                      <Link 
                        href="/client-join"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-md transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-medium">Client</div>
                          <div className="text-xs text-gray-500">Book trips & manage reservations</div>
                        </div>
                      </Link>

                      {/* Agency Option */}
                      <Link 
                        href="/agency-join"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-md transition-colors mt-1"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center mr-3">
                          <Building2 className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-medium">Agency</div>
                          <div className="text-xs text-gray-500">Manage tours & clients</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu (Optional) */}
        <div className="md:hidden flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-700 hover:text-cyan-600">Home</Link>
            <Link href="/agencies" className="text-gray-700 hover:text-cyan-600">Agencies</Link>
            <Link href="/services" className="text-gray-700 hover:text-cyan-600">Services</Link>
          </div>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-700 hover:text-cyan-600"
          >
            Menu
          </button>
        </div>
      </div>
    </nav>
  );
}