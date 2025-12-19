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
  Headphones 
} from 'lucide-react';
import NavBar from '@/components/Navbar2';

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
    // tripType: 'vacation'
  });

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching packages:', searchParams);
    // Implement search logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Journey Begins with Travyotei
            </h1>
            <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Custom travel planning and ticket booking. Experience seamless travel with our all-in-one platform.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-900">Find Your Perfect Trip</h2>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Departure
                </label>
                <input
                  type="text"
                  value={searchParams.departure}
                  onChange={(e) => setSearchParams({...searchParams, departure: e.target.value})}
                  placeholder="Where are you leaving from?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Destination
                </label>
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  placeholder="Where do you want to go?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Check-in day
                </label>
                <input
                  type="date"
                  value={searchParams.checkInDay}
                  onChange={(e) => setSearchParams({...searchParams, checkInDay: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Departure time
                </label>
                <input
                  type="time"
                  value={searchParams.checkInTime}
                  onChange={(e) => setSearchParams({...searchParams, checkInTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Travelers
                </label>
                <div className="flex space-x-2">
                  <select
                    value={searchParams.travelers.adults}
                    onChange={(e) => setSearchParams({
                      ...searchParams, 
                      travelers: {...searchParams.travelers, adults: parseInt(e.target.value)}
                    })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <select
                    value={searchParams.travelers.children}
                    onChange={(e) => setSearchParams({
                      ...searchParams, 
                      travelers: {...searchParams.travelers, children: parseInt(e.target.value)}
                    })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {[0,1,2,3,4].map(num => (
                      <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-cyan-500 mr-2" />
                  <span className="text-sm text-gray-600">Secure Booking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cyan-500 mr-2" />
                  <span className="text-sm text-gray-600">Best Price Guarantee</span>
                </div>
              </div>
              
              <button
                type="submit"
                className="cursor-pointer px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Available Trips
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for Your Bus Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <service.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="bg-gray-50 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900">Popular Bus Routes</h2>
      <button className="text-cyan-600 font-medium hover:text-cyan-700 flex items-center">
        View All Routes <ChevronRight className="h-5 w-5 ml-1" />
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

      {/* Travel Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Travel Packages</h2>
            <p className="text-gray-600 mt-2">All-inclusive packages curated by our travel experts</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                {/* Package Image/Color Block */}
                <div className={`${pkg.imageColor} md:w-1/3 h-48 md:h-auto relative`}>
                  <div className="absolute top-4 left-4">
                    <span className={`${pkg.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {pkg.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white">
                      {/* <div className="text-2xl font-bold">{pkg.days}D/{pkg.nights}N</div> */}
                      <div className="text-sm opacity-90">{pkg.duration}</div>
                    </div>
                  </div>
                </div>
                
                {/* Package Details */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{pkg.title}</h3>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{pkg.location}</span>
                        <div className="flex items-center ml-4">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{pkg.rating}</span>
                          <span className="ml-1 text-gray-500">({pkg.reviews} reviews)</span>
                        </div>
                      </div>
                      <p className="text-cyan-600 font-medium mt-2">{pkg.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                        FCFA {pkg.price}
                      </div>
                      <div className="text-gray-600">per person</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Package Includes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {pkg.amenities.map((amenity, index) => (
                        <span key={index} className="flex items-center text-gray-600 text-sm">
                          <CheckCircle className="h-4 w-4 text-cyan-500 mr-1" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <button className="px-6 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors">
                        View Details
                      </button>
                      <button 
                        onClick={() => setSelectedPackage(pkg.id)}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}