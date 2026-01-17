'use client';

import { useState, useEffect } from 'react';
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
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '@/components/Navbar2';
import { BusSeatSimulation } from '@/components/BusSeatSimulation';
import { AgencyLogo } from '@/components/AgencyLogo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Route options
const routes = [
  {
    name: "Douala → Yaoundé",
    image: "bg-gradient-to-br from-cyan-500 to-blue-600",
    rating: "4.5",
    badge: "Most Popular",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
    trips: 40,
    companies: "6+",
    duration: "3-4 hours",
    price: "5,000 FCFA"
  },

  {
    name: "Yaoundé → Bamenda",
    image: "bg-gradient-to-br from-green-500 to-teal-600",
    rating: "4.3",
    badge: "Scenic Route",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500",
    trips: 25,
    companies: "4+",
    duration: "5-6 hours",
    price: "8,500 FCFA"
  },
  {
    name: "Douala → Buea/Limbé",
    image: "bg-gradient-to-br from-blue-500 to-indigo-600",
    rating: "4.6",
    badge: "Coastal",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    trips: 35,
    companies: "5+",
    duration: "1-2 hours",
    price: "2,500 FCFA"
  },
  {
    name: "Yaoundé → Bafoussam",
    image: "bg-gradient-to-br from-purple-500 to-pink-600",
    rating: "4.2",
    badge: "Frequent",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    trips: 30,
    companies: "4+",
    duration: "3-4 hours",
    price: "4,500 FCFA"
  },
  {
    name: "Douala → Kribi",
    image: "bg-gradient-to-br from-yellow-500 to-orange-600",
    rating: "4.7",
    badge: "Beach Destination",
    badgeColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
    trips: 15,
    companies: "3+",
    duration: "2-3 hours",
    price: "3,500 FCFA"
  },
  {
    name: "Bamenda → Buea",
    image: "bg-gradient-to-br from-red-500 to-pink-600",
    rating: "4.4",
    badge: "Cross-Region",
    badgeColor: "bg-gradient-to-r from-red-500 to-orange-500",
    trips: 12,
    companies: "3+",
    duration: "6-7 hours",
    price: "10,000 FCFA"
  }
];

// Travel packages
const packages = [
  {
    id: 1,
    title: "Amour Mezam Express VIP",
    location: "Douala → Yaoundé",
    rating: 4.8,
    reviews: 1247,
    description: "Premium Comfort Service",
    features: ["VIP Seats", "WiFi Onboard", "USB Charging", "Snack Service", "Extra Legroom"],
    price: 5000,
    duration: "3-4 hours",
    departure: "6:00 AM, 2:00 PM, 8:00 PM",
    amenities: ["Air Conditioning", "Toilet Onboard", "Entertainment", "Priority Boarding", "Insurance"],
    badge: "Most Booked",
    badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
    imageColor: "bg-gradient-to-br from-cyan-400 to-blue-400",
    company: "Amour Mezam Express",
    availableSeats: 12
  },
  {
    id: 2,
    title: "Guarantee Express Coastal",
    location: "Douala → Limbe",
    rating: 4.6,
    reviews: 892,
    description: "Scenic Coastal Route",
    features: ["Direct Route", "Ocean Views", "Frequent Departures", "Baggage Allowance", "Beach Drop-off"],
    price: 3500,
    duration: "2 hours",
    departure: "Every 30 mins (6AM-8PM)",
    amenities: ["AC", "Comfort Seats", "On-time Guarantee", "Window Views", "Quick Check-in"],
    badge: "Popular",
    badgeColor: "bg-gradient-to-r from-cyan-400 to-blue-400",
    imageColor: "bg-gradient-to-br from-cyan-300 to-blue-300",
    company: "Guarantee Express",
    availableSeats: 8
  },
  {
    id: 3,
    title: "Santa Barbara Overnight",
    location: "Yaoundé → Bamenda",
    rating: 4.9,
    reviews: 1563,
    description: "Overnight Journey",
    features: ["Sleeper Seats", "Overnight Route", "Blanket Provided", "Security Escort", "Morning Arrival"],
    price: 6000,
    duration: "6-7 hours",
    departure: "10:00 PM, 11:00 PM",
    amenities: ["Reclining Seats", "Night Security", "Pillow", "Wake-up Service", "Hot Drink"],
    badge: "Limited Seats",
    badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-600",
    imageColor: "bg-gradient-to-br from-cyan-400 to-blue-500",
    company: "Santa Barbara",
    availableSeats: 3
  },
  {
    id: 4,
    title: "L'Hirondelle Family Package",
    location: "Douala → Bafoussam",
    rating: 4.5,
    reviews: 987,
    description: "Family-Friendly Travel",
    features: ["Child Discount", "Family Seating", "Kids Entertainment", "Baby Changing", "Flexible Booking"],
    price: 6000,
    duration: "3 hours",
    departure: "7:00 AM, 1:00 PM, 5:00 PM",
    amenities: ["AC", "Spacious Legroom", "Movie Screen", "Snack Box", "Friendly Staff"],
    badge: "Family Deal",
    badgeColor: "bg-gradient-to-r from-cyan-400 to-blue-500",
    imageColor: "bg-gradient-to-br from-cyan-300 to-blue-400",
    company: "L'Hirondelle",
    availableSeats: 15
  },
  {
    id: 5,
    title: "BuBu Express Economy",
    location: "Yaoundé → Kribi",
    rating: 4.3,
    reviews: 745,
    description: "Budget-Friendly Option",
    features: ["Lowest Price", "Frequent Trips", "Reliable Service", "Essential Comfort", "No Hidden Fees"],
    price: 3000,
    duration: "2.5 hours",
    departure: "Every hour (5AM-7PM)",
    amenities: ["Basic Seats", "Baggage Storage", "On-time Service", "Affordable", "Easy Booking"],
    badge: "Best Value",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500",
    imageColor: "bg-gradient-to-br from-green-300 to-emerald-400",
    company: "BuBu Express",
    availableSeats: 22
  },
  {
    id: 6,
    title: "Achaba Motos Express",
    location: "City Center Routes",
    rating: 4.7,
    reviews: 2103,
    description: "Intra-City Mototaxi",
    features: ["Quick Transport", "City Coverage", "Instant Booking", "Affordable Rates", "24/7 Service"],
    price: 5000,
    duration: "10-30 mins",
    departure: "On-demand",
    amenities: ["Helmet Provided", "GPS Tracking", "Cashless Payment", "Safety Rated", "Local Drivers"],
    badge: "City Favorite",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
    imageColor: "bg-gradient-to-br from-orange-300 to-red-400",
    company: "Achaba Network",
    availableSeats: 50
  }
];
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
  });

  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'default'>('default');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    // Simulate search delay
    setTimeout(() => {
      const totalRequestedSeats = (searchParams.travelers.adults || 0) + (searchParams.travelers.children || 0);
      
      let filtered = packages.filter(pkg => {
        const departureLower = searchParams.departure.toLowerCase().trim();
        const destinationLower = searchParams.destination.toLowerCase().trim();
        const pkgLocationLower = pkg.location.toLowerCase();
        const pkgTitleLower = pkg.title.toLowerCase();

        const matchesDeparture = !departureLower || 
          pkgLocationLower.includes(departureLower) || 
          pkgTitleLower.includes(departureLower);
        
        const matchesDestination = !destinationLower || 
          pkgLocationLower.includes(destinationLower) || 
          pkgTitleLower.includes(destinationLower);
          
        const hasEnoughSeats = pkg.availableSeats >= totalRequestedSeats;

        return matchesDeparture && matchesDestination && hasEnoughSeats;
      });

      // Apply sorting
      if (sortBy === 'price') {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (sortBy === 'rating') {
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      }

      setFilteredPackages(filtered);
      setIsSearching(false);
      
      const resultsSection = document.getElementById('travel-packages');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  // Re-sort when sortBy changes
  useEffect(() => {
    if (hasSearched) {
      let sorted = [...filteredPackages];
      if (sortBy === 'price') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating);
      }
      setFilteredPackages(sorted);
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-500">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-cyan-600 to-blue-700 dark:from-slate-900 dark:to-slate-950 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter"
            >
              Votre Voyage Commence ici
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-cyan-100/80 dark:text-slate-400 mb-10 max-w-3xl mx-auto font-medium"
            >
              Connectez-vous aux meilleures agences du Cameroun avec Travyotei. Confort, Sécurité et Fiabilité à chaque trajet.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100 dark:border-slate-800 backdrop-blur-xl">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Search className="h-7 w-7 text-white" />
            </div>
            <div className="ml-5">
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">Trouvez votre trajet</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Réservez en quelques clics</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  <MapPin className="inline h-3 w-3 mr-1 text-cyan-500" />
                  Départ
                </label>
                <input
                  type="text"
                  value={searchParams.departure}
                  onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
                  placeholder="Ville de départ"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  <MapPin className="inline h-3 w-3 mr-1 text-cyan-500" />
                  Destination
                </label>
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  placeholder="Où allez-vous ?"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  <Calendar className="inline h-3 w-3 mr-1 text-cyan-500" />
                  Date
                </label>
                <input
                  type="date"
                  value={searchParams.checkInDay}
                  onChange={(e) => setSearchParams({ ...searchParams, checkInDay: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  <Clock className="inline h-3 w-3 mr-1 text-cyan-500" />
                  Heure
                </label>
                <input
                  type="time"
                  value={searchParams.checkInTime}
                  onChange={(e) => setSearchParams({ ...searchParams, checkInTime: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  <Users className="inline h-3 w-3 mr-1 text-cyan-500" />
                  Voyageurs
                </label>
                <div className="flex space-x-2">
                  <select
                    value={searchParams.travelers.adults}
                    onChange={(e) => setSearchParams({
                      ...searchParams,
                      travelers: { ...searchParams.travelers, adults: parseInt(e.target.value) }
                    })}
                    className="flex-1 px-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white transition-all hover:bg-white dark:hover:bg-slate-700"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num} className="bg-white dark:bg-slate-900">{num} Adulte{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <select
                    value={searchParams.travelers.children}
                    onChange={(e) => setSearchParams({
                      ...searchParams,
                      travelers: { ...searchParams.travelers, children: parseInt(e.target.value) }
                    })}
                    className="flex-1 px-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white transition-all hover:bg-white dark:hover:bg-slate-700"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num} className="bg-white dark:bg-slate-900">{num} Enfant{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center group cursor-help">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3 group-hover:bg-cyan-500/20 transition-colors">
                    <Shield className="h-5 w-5 text-cyan-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-slate-400">Paiement Sécurisé</span>
                </div>
                <div className="flex items-center group cursor-help">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3 group-hover:bg-cyan-500/20 transition-colors">
                    <CheckCircle className="h-5 w-5 text-cyan-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-slate-400">Garantie Meilleur Prix</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className={`w-full md:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:brightness-110 shadow-2xl shadow-cyan-500/30 active:scale-95 transition-all flex items-center justify-center ${isSearching ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-3" />
                    Rechercher les trajets
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-16 italic tracking-tight uppercase">
          Pourquoi choisir Travyotei ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-cyan-500 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{service.title}</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="bg-gray-50 dark:bg-slate-900/30 py-20 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tight uppercase">Routes Populaires</h2>
              <p className="text-gray-500 dark:text-slate-400">Les destinations les plus fréquentées</p>
            </div>
            <button className="text-cyan-600 dark:text-cyan-400 font-bold hover:gap-2 transition-all flex items-center group">
              Voir tout <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`${route.image} h-48 rounded-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`${route.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {route.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{route.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm ml-1">{route.rating}+</span>
                      </div>
                      <div className="flex items-center text-white text-sm bg-black/30 px-2 py-1 rounded">
                        <Bus className="h-4 w-4 mr-1" />
                        <span>{route.trips} trips/day</span>
                      </div>
                    </div>
                    <div className="mt-2 text-cyan-200 text-sm">
                      {route.companies} bus companies • {route.duration}
                    </div>
                    <div className="mt-2 text-white text-lg font-semibold">
                      From {route.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="travel-packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tight uppercase">
              {hasSearched ? `Résultats (${filteredPackages.length})` : "Offres Spéciales"}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">
              {hasSearched 
                ? "Trajets correspondant à vos critères de recherche"
                : "Packs voyage exclusifs par nos experts"
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl border border-gray-200 dark:border-slate-700">
               <button 
                onClick={() => setSortBy('price')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'price' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
               >
                 Prix
               </button>
               <button 
                onClick={() => setSortBy('rating')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'rating' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
               >
                 Avis
               </button>
            </div>
            {hasSearched && (
              <button 
                onClick={() => {
                  setFilteredPackages(packages);
                  setHasSearched(false);
                  setSortBy('default');
                  setSearchParams({
                    departure: '',
                    destination: '',
                    checkInDay: '',
                    checkInTime: '',
                    travelers: { adults: 1, children: 0 }
                  });
                }}
                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-8 min-h-[400px]">
          {isSearching ? (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6" />
               <p className="text-xl font-bold text-gray-400 animate-pulse uppercase tracking-widest">Optimisation des meilleurs trajets...</p>
             </div>
          ) : filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={pkg.id} 
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-800 group"
              >
                <div className="md:flex">
                  {/* Package Image/Logo Section */}
                  <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                    <AgencyLogo
                      agencyName={pkg.company}
                      className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-500"
                      fallbackClassName={`${pkg.imageColor} flex items-center justify-center`}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`${pkg.badgeColor} text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest`}>
                        {pkg.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-widest border border-white/20">
                        {pkg.duration}
                      </div>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="md:w-2/3 p-8">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md">
                            {pkg.company}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
                            {pkg.availableSeats} Places libres
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight">{pkg.title}</h3>
                        <div className="flex items-center mt-3">
                          <MapPin className="h-4 w-4 text-cyan-500 mr-2" />
                          <span className="text-gray-600 dark:text-slate-400 font-medium">{pkg.location}</span>
                          <div className="flex items-center ml-6">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-black text-gray-900 dark:text-white">{pkg.rating}</span>
                            <span className="ml-1 text-gray-500">({pkg.reviews} avis)</span>
                          </div>
                        </div>
                        <p className="text-cyan-600 dark:text-cyan-400 font-bold mt-4 uppercase tracking-tighter">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent italic tracking-tighter">
                          {pkg.price} FCFA
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-500 uppercase font-black">par personne</div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-black text-gray-900 dark:text-white mb-4 uppercase text-[10px] tracking-widest italic opacity-60">Le pack comprend :</h4>
                      <div className="flex flex-wrap gap-3">
                        {pkg.features.map((feature, index) => (
                          <span key={index} className="px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-100 dark:border-slate-800 pt-8">
                      <div className="flex flex-wrap gap-4">
                        {pkg.amenities.map((amenity, index) => (
                          <span key={index} className="flex items-center text-gray-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-4 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-8 py-4 border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-cyan-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                          Détails
                        </button>
                        <button
                          onClick={() => setSelectedPackage(pkg.id)}
                          className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-2">Aucun trajet trouvé</h3>
              <p className="text-gray-500 dark:text-slate-400 text-center max-w-md px-6">
                Nous n&apos;avons pas trouvé de trajets correspondant à vos critères. Essayez d&apos;ajuster vos villes ou de réduire le nombre de voyageurs.
              </p>
              <button 
                onClick={() => {
                  setFilteredPackages(packages);
                  setHasSearched(false);
                }}
                className="mt-8 px-8 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-xl">Months of Experience</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">200K+</div>
              <div className="text-xl">Happy Travelers</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-xl">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
                <li><a href="#" className="text-gray-400 hover:text-white">Easy Online Booking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Major routes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Notification Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partner bus companies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Travel Insurance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025-2026 Travyotei, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 3D Seat Selection Dialog for Client */}
      <Dialog open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-950 border-slate-800">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <Bus className="h-6 w-6 text-cyan-500" />
              Choose Your Perfect Seat
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Immersive 3D view of {packages.find(p => p.id === selectedPackage)?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6">
            {selectedPackage && (
              <BusSeatSimulation
                totalSeats={70} // Example dynamic seat count
                occupiedSeats={["1A", "2B", "3C", "10A", "10B", "15C", "20D"]} // Simulated live data
                onSeatSelect={(seat) => {
                  console.log(`Seat ${seat} selected for package ${selectedPackage}`);
                  // Here you would proceed to payment/checkout
                  alert(`Seat ${seat} selected! Moving to payment...`);
                  setSelectedPackage(null);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}