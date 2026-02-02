'use client';

import { useState } from 'react';
import {
  Search,
  Shield,
  Star,
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  Award,
  ChevronRight,
  Plane,
  Hotel,
  Car,
  Globe,
  Utensils,
  Wifi,
  Navigation,
  Phone,
  Clock,
  Heart,
  Filter,
  Bus,
  Ticket,
  Smartphone,
  Bell,
  Headphones,
  ArrowRight,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/Navbar2';

// Services
const services = [
  {
    icon: Bus,
    title: "Partner Bus Companies",
    description: "Book tickets from trusted transport companies like Amour Mezam Express across Cameroon"
  },
  {
    icon: Ticket,
    title: "Easy Online Booking",
    description: "Find your trip, choose seats, and pay securely using MTN Money or Orange Money"
  },
  {
    icon: MapPin,
    title: "Major City Routes",
    description: "Travel between key destinations like Yaoundé, Douala, Bamenda, Buea, and Limbé"
  },
  {
    icon: Bell,
    title: "Get Notified",
    description: "Receive alerts when your favorite bus company publishes new tickets online"
  }
];


export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    checkInDay: '',
    checkInTime: '',
    travelers: { adults: 1, children: 0 },
    // tripType: 'vacation'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching packages:', searchParams);
    // Implement search logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section - Cinematic & Immersive */}
      <div className="relative min-h-[85vh] flex items-center pt-20">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-950" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]"
          />

          {/* Main Visual - Can be an image or a complex gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-cyan-500/10 backdrop-blur-md rounded-full border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-8"
              >
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Cameroon Mobility Innovation
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.85] mb-8 uppercase">
                <span className="block">YOUR JOURNEY</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">STARTS HERE</span>
              </h1>

              <p className="text-xl text-slate-400 font-medium max-w-xl mb-10 leading-relaxed">
                Connect with Cameroon&apos;s best travel agencies. Tailored planning, instant booking, and real-time tracking.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="px-10 py-5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-cyan-500/20">
                  Explore Agencies
                </button>
                <button className="px-10 py-5 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
                  Traveler Guide
                </button>
              </div>
            </motion.div>

            {/* Search Section - Floating Command Center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-cyan-500/20 rounded-3xl blur-3xl opacity-50" />
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16" />

                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Command Center</h2>
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest opacity-60">Smart Multi-criteria Search</p>
                  </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Departure</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={searchParams.departure}
                          onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
                          placeholder="Origin..."
                          className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Destination</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={searchParams.destination}
                          onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                          placeholder="Destination..."
                          className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Travel Date</label>
                      <div className="relative group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500 transition-colors" />
                        <input
                          type="date"
                          value={searchParams.checkInDay}
                          onChange={(e) => setSearchParams({ ...searchParams, checkInDay: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 text-white transition-all outline-none [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Passengers</label>
                      <div className="relative group">
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500 transition-colors" />
                        <select
                          value={searchParams.travelers.adults}
                          onChange={(e) => setSearchParams({
                            ...searchParams,
                            travelers: { ...searchParams.travelers, adults: parseInt(e.target.value) }
                          })}
                          className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 text-white transition-all outline-none appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num} className="bg-slate-900">{num} Traveler{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-white text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cyan-400 hover:text-white transition-all duration-300 shadow-xl active:scale-95 group"
                  >
                    Search Available Trips
                    <ChevronRight className="inline-block h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex justify-center gap-6 pt-2">
                    <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      <Shield className="h-4 w-4 text-cyan-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Guaranteed Security</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Best Rate</span>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Section - Bento Grid Logic */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4 italic"
          >
            Integrated Experience
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase"
          >
            Everything you need <br /> for your bus journey
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group p-8 rounded-2xl border border-gray-100 dark:border-white/5 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none ${index === 0 || index === 3 ? 'md:col-span-1 lg:bg-slate-900 dark:lg:bg-slate-900/50' : 'md:col-span-1 bg-white dark:bg-slate-900'
                }`}
            >
              <div className="mb-8 relative">
                <div className="absolute -inset-2 bg-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-16 h-16 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-cyan-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase mb-4 leading-none">
                {service.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>



      {/* Trust Indicators - Cinematic Statistics */}
      <div className="relative py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449156001935-d2863fb72619?auto=format&fit=crop&q=80')] bg-cover bg-fixed bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { label: "Months of Experience", value: "4", suffix: "" },
              { label: "Happy Travelers", value: "200K", suffix: "+" },
              { label: "Average Rating", value: "4.9", suffix: "/5" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                <div className="inline-block text-8xl font-black text-white italic tracking-tighter uppercase mb-2 group-hover:text-cyan-400 transition-colors">
                  {stat.value}<span className="text-cyan-500">{stat.suffix}</span>
                </div>
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] italic opacity-60">
                  {stat.label}
                </div>
                <div className="mt-6 w-12 h-1 bg-white/20 rounded-full group-hover:w-24 transition-all duration-700 mx-auto md:mx-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Travyotei</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in custom travel planning and seamless bookings since Sept 2025.
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <Phone className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="text-sm text-gray-400">Need help? Call us</div>
                  <div className="font-medium">681 154 869</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Easy Online Booking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Major routes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Notification Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner bus companies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Insurance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025-2026 Travyotei, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}