// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import {
  User,
  Ticket,
  Heart,
  History,
  CreditCard,
  Settings,
  MapPin,
  Users,
  Calendar,
  Bell,
  LogOut,
  ChevronRight,
  Star,
  Clock,
  Bus,
  Wallet,
  Shield,
  Phone,
  Mail
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState({
    name: "Arreyntow Kerone",
    email: "peterparker@gmail.com",
    phone: "+237 655 123 456",
    memberSince: "June 2025",
    travelerPoints: 1470,
    avatarColor: "bg-gradient-to-r from-cyan-500 to-blue-500"
  });

  const [activeTab, setActiveTab] = useState('tickets');

  // Dashboard Menu Items
  const menuItems = [
    { id: 'tickets', icon: Ticket, label: 'Tickets', count: 3 },
    { id: 'favorite', icon: Heart, label: 'Favorite', count: 5 },
    { id: 'history', icon: History, label: 'History', count: 12 },
    { id: 'payment', icon: CreditCard, label: 'Payment', count: 2 },
    { id: 'setting', icon: Settings, label: 'Setting', count: null }
  ];

  // Popular Routes (Upcoming/Recent)
  const popularRoutes = [
    {
      id: 1,
      from: "Douala",
      to: "Yaoundé",
      company: "Amour Mezam Express",
      date: "Dec 15, 2023",
      time: "08:00 AM",
      price: "5,000 FCFA",
      status: "Confirmed",
      passengers: 1,
      busType: "VIP",
      color: "from-cyan-400 to-blue-400"
    },
    {
      id: 2,
      from: "Yaoundé",
      to: "Bamenda",
      company: "Guarantee Express",
      date: "Dec 18, 2023",
      time: "10:00 AM",
      price: "8,500 FCFA",
      status: "Pending",
      passengers: 2,
      busType: "Standard",
      color: "from-green-400 to-teal-400"
    },
    {
      id: 3,
      from: "Douala",
      to: "Kribi",
      company: "Santa Barbara",
      date: "Dec 22, 2023",
      time: "02:00 PM",
      price: "4,000 FCFA",
      status: "Confirmed",
      passengers: 1,
      busType: "Coastal",
      color: "from-blue-400 to-indigo-400"
    }
  ];

  // Favorite Agencies
  const favoriteAgencies = [
    {
      id: 1,
      name: "Amour Mezam Express",
      rating: 4.8,
      reviews: "1.2k",
      routes: "Douala - Yaoundé - Bamenda",
      trips: "40+ daily trips",
      isFavorited: true,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500"
    },
    {
      id: 2,
      name: "Guarantee Express",
      rating: 4.6,
      reviews: "892",
      routes: "Coastal routes",
      trips: "35+ daily trips",
      isFavorited: true,
      color: "bg-gradient-to-r from-green-500 to-teal-500"
    },
    {
      id: 3,
      name: "Santa Barbara",
      rating: 4.9,
      reviews: "1.5k",
      routes: "Overnight services",
      trips: "20+ daily trips",
      isFavorited: true,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500"
    }
  ];

  // Payment Methods
  const paymentMethods = [
    { id: 1, type: "MTN Mobile Money", number: "655 123 456", isDefault: true },
    { id: 2, type: "Orange Money", number: "677 987 654", isDefault: false },
    { id: 3, type: "Visa", number: "**** 4832", isDefault: false }
  ];

  // Calendar days
  const calendarDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDates = [
    [29, 30, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 1, 2]
  ];

  // Today's date
  const today = new Date();
  const currentDay = today.getDate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Travyotei
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-cyan-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 text-sm">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Menu */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 rounded-full ${user.avatarColor} flex items-center justify-center`}>
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">Traveler • Member since {user.memberSince}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">Premium Member</span>
                  </div>
                </div>
              </div>

              {/* Traveler Points */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Traveler Points</span>
                  <span className="font-bold text-cyan-600">{user.travelerPoints} points</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (user.travelerPoints / 2000) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">500 more points for Gold status</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 text-cyan-500 mr-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 text-cyan-500 mr-3" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Dashboard Menu */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 px-2">Dashboard</h3>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === item.id
                        ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center">
                      {item.count !== null && (
                        <span className="bg-cyan-100 text-cyan-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                          {item.count}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">December 2023</h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {calendarDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              {calendarDates.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                  {week.map((date, dateIndex) => (
                    <div
                      key={dateIndex}
                      className={`h-8 flex items-center justify-center rounded-lg text-sm ${date === currentDay
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold'
                          : date < 26 && date > currentDay
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-400'
                        }`}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-6 p-3 bg-cyan-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Bus className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Trip to Yaoundé</p>
                    <p className="text-xs text-gray-600">Dec 15 • 08:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              {/* Header with tabs */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab === 'tickets' ? 'My Tickets' :
                    activeTab === 'favorite' ? 'Favorite Agencies' :
                      activeTab === 'history' ? 'Travel History' :
                        activeTab === 'payment' ? 'Payment Methods' : 'Settings'}
                </h2>
                <button className="px-4 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 text-sm font-medium">
                  View All
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  {popularRoutes.map((route) => (
                    <div key={route.id} className="border border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${route.color} flex items-center justify-center`}>
                              <Bus className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-gray-900">
                                {route.from} → {route.to}
                              </h3>
                              <p className="text-sm text-gray-600">{route.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {route.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {route.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {route.passengers} passenger(s)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                            {route.price}
                          </div>
                          <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${route.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {route.status}
                          </div>
                          <button className="mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 text-sm">
                            View Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'favorite' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteAgencies.map((agency) => (
                    <div key={agency.id} className="border border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-12 h-12 rounded-lg ${agency.color} flex items-center justify-center`}>
                          <Bus className="h-6 w-6 text-white" />
                        </div>
                        <button className="text-red-500 hover:text-red-600">
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{agency.name}</h3>
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{agency.rating}</span>
                        <span className="ml-2 text-gray-600">({agency.reviews} reviews)</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {agency.routes}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {agency.trips}
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 text-sm font-medium">
                        Book with {agency.name.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-cyan-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-gray-900">{method.type}</h3>
                            <p className="text-sm text-gray-600">{method.number}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {method.isDefault && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              Default
                            </span>
                          )}
                          <button className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                        <CreditCard className="h-6 w-6 text-cyan-600" />
                      </div>
                      <p className="text-cyan-600 font-medium">Add Payment Method</p>
                      <p className="text-sm text-gray-600 mt-1">MTN Money, Orange Money, or Card</p>
                    </div>
                  </button>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  {/* This would be similar to tickets but with past trips */}
                  <p className="text-gray-600 text-center py-8">
                    Your travel history will appear here
                  </p>
                </div>
              )}

              {activeTab === 'setting' && (
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Receive LOHCE codes via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Security</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        Change Password
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        Two-Factor Authentication
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        Login Activity
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">50% Discount</h3>
                  <p className="text-cyan-100">
                    Book 3 trips in December and get 50% off your 4th trip!
                  </p>
                  <div className="flex items-center mt-4">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="text-sm">Limited time offer • Valid until Dec 31</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">50%</div>
                  <div className="text-cyan-100">OFF</div>
                </div>
              </div>
              <button className="w-full mt-6 px-4 py-3 bg-white text-cyan-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Claim Offer Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <button className="flex items-center justify-center w-full max-w-sm mx-auto px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}