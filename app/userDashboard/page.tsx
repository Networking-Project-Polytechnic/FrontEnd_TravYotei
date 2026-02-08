
'use client';

import { useState } from 'react';
import {
  User,
  Ticket,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Bus,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { logout } = useAuth();
  const [user] = useState({
    name: "Arreyntow Kerone",
    email: "peterparker@gmail.com",
    memberSince: "June 2025",
  });

  const [activeTab, setActiveTab] = useState('tickets');

  const menuItems = [
    { id: 'tickets', icon: Ticket, label: 'My Tickets' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'payment', icon: CreditCard, label: 'Payment' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Mock Data
  const upcomingTrips = [
    {
      id: 1,
      from: "Douala",
      to: "Yaoundé",
      date: "Dec 15, 2023",
      time: "08:00 AM",
      company: "Amour Mezam",
      price: "5,000 FCFA",
      status: "Confirmed"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-gray-100 dark:border-slate-800 pb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="mt-4 md:mt-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="md:col-span-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                  }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Upcoming Trips</h2>
                {upcomingTrips.length > 0 ? (
                  upcomingTrips.map((trip) => (
                    <div key={trip.id} className="group border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mr-4 text-cyan-600 dark:text-cyan-400">
                            <Bus className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center text-lg font-bold text-slate-900 dark:text-white">
                              {trip.from} <span className="mx-2 text-slate-300">→</span> {trip.to}
                            </div>
                            <div className="text-sm text-slate-500">{trip.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 opacity-70" />
                            {trip.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 opacity-70" />
                            {trip.time}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                            {trip.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Ticket className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No upcoming trips</h3>
                    <p className="text-slate-500">Book your next journey today</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Heart className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No favorites yet</h3>
                <p className="text-slate-500">Save your favorite agencies for quick access</p>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Payment Methods</h2>
                <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">Add new payment method</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                      <p className="text-sm text-slate-500">Receive booking updates via email</p>
                    </div>
                    <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-slate-500">Toggle application theme</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}