// app/agencies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bus, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  CheckCircle,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  Users,
  Car,
  Wifi,
  Coffee,
  Wind,
  AlertCircle
} from 'lucide-react';

// Import your API function
import { getAgencies } from '@/lib/api';

// Dummy data for when no agencies are found
const dummyAgencies = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Ndongo",
    userName: "amourmezam",
    email: "contact@amourmezam.cm",
    phoneNumber: 237655123456,
    address: "Mile 17 Motor Park, Douala, Cameroon",
    licenseNumber: "AMX-2023-001",
    profileImageUrl: "/api/placeholder/400/300",
    role: "AGENCY",
    status: "ACTIVE",
    rating: 4.8,
    reviewCount: 1247,
    routes: ["Douala-Yaoundé", "Douala-Bafoussam", "Douala-Bamenda"],
    fleetSize: 45,
    yearsOperating: 15,
    features: ["VIP Seats", "WiFi Onboard", "USB Charging", "Snack Service"],
    schedules: ["6:00 AM", "2:00 PM", "8:00 PM"]
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Tchoumi",
    userName: "guaranteeexpress",
    email: "info@guarantee.cm",
    phoneNumber: 237677987654,
    address: "Nkwen Motor Park, Bamenda, Cameroon",
    licenseNumber: "GEX-2023-002",
    profileImageUrl: "/api/placeholder/400/300",
    role: "AGENCY",
    status: "ACTIVE",
    rating: 4.6,
    reviewCount: 892,
    routes: ["Bamenda-Yaoundé", "Bamenda-Douala", "Bamenda-Buea"],
    fleetSize: 32,
    yearsOperating: 12,
    features: ["Direct Routes", "Ocean Views", "Frequent Departures"],
    schedules: ["5:00 AM", "11:00 AM", "4:00 PM", "9:00 PM"]
  },
  {
    id: 3,
    firstName: "Paul",
    lastName: "Fokou",
    userName: "santabarbara",
    email: "reservation@santabarbara.cm",
    phoneNumber: 237690112233,
    address: "Mvan Motor Park, Yaoundé, Cameroon",
    licenseNumber: "SBB-2023-003",
    profileImageUrl: "/api/placeholder/400/300",
    role: "AGENCY",
    status: "ACTIVE",
    rating: 4.9,
    reviewCount: 1563,
    routes: ["Yaoundé-Douala", "Yaoundé-Kribi", "Yaoundé-Bafoussam"],
    fleetSize: 58,
    yearsOperating: 20,
    features: ["Sleeper Seats", "Overnight Service", "Security Escort"],
    schedules: ["10:00 PM", "11:00 PM"]
  },
  {
    id: 4,
    firstName: "Chantal",
    lastName: "Ngo",
    userName: "lhirondelle",
    email: "service@lhirondelle.cm",
    phoneNumber: 237699445566,
    address: "Bonduma Park, Buea, Cameroon",
    licenseNumber: "LHL-2023-004",
    profileImageUrl: "/api/placeholder/400/300",
    role: "AGENCY",
    status: "ACTIVE",
    rating: 4.5,
    reviewCount: 987,
    routes: ["Buea-Limbe", "Buea-Douala", "Buea-Yaoundé"],
    fleetSize: 28,
    yearsOperating: 10,
    features: ["Family Packages", "Child Discount", "Kids Entertainment"],
    schedules: ["7:00 AM", "1:00 PM", "5:00 PM"]
  }
];

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Locations for filtering
  const locations = ['All', 'Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Limbe', 'Bafoussam', 'Kribi'];

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const data = await getAgencies();
      
      // If we get data from API, use it
      if (data && data.length > 0) {
        setAgencies(data);
      } else {
        // If no data from API, use dummy data
        setAgencies(dummyAgencies);
      }
    } catch (err) {
      console.error('Error fetching agencies:', err);
      setError('Failed to load agencies. Using sample data.');
      // Use dummy data on error
      setAgencies(dummyAgencies);
    } finally {
      setLoading(false);
    }
  };

  // Filter agencies based on search and location
  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = searchTerm === '' || 
      agency.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.routes?.some((route: string) => 
        route.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesLocation = selectedLocation === '' || 
      selectedLocation === 'All' ||
      agency.address?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      agency.routes?.some((route: string) => 
        route.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    
    return matchesSearch && matchesLocation;
  });

  // Get agency display name
  const getAgencyName = (agency: any) => {
    if (agency.userName) {
      // Convert username to display name (e.g., "amourmezam" → "Amour Mezam Express")
      const nameMap: { [key: string]: string } = {
        'amourmezam': 'Amour Mezam Express',
        'guaranteeexpress': 'Guarantee Express',
        'santabarbara': 'Santa Barbara',
        'lhirondelle': 'L\'Hirondelle',
        'bubuexpress': 'BuBu Express'
      };
      return nameMap[agency.userName] || 
        agency.userName.charAt(0).toUpperCase() + agency.userName.slice(1) + ' Travels';
    }
    return `${agency.firstName} ${agency.lastName}'s Agency`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading agencies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted Bus Agencies
            </h1>
            <p className="text-xl text-cyan-100">
              Partnered with Cameroon&apos;s most reliable transport companies
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agencies by name, route, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Location Filter */}
            <div className="w-full md:w-64">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-yellow-700">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAgencies.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No agencies found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredAgencies.length} {filteredAgencies.length === 1 ? 'Agency' : 'Agencies'} Found
                </h2>
                <p className="text-gray-600 mt-1">Click on any agency to view their full profile</p>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 text-cyan-500 mr-1" />
                <span>All agencies are verified & licensed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgencies.map((agency) => (
                <Link 
                  key={agency.id} 
                  href={`/agencies/${agency.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Agency Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-40 relative">
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-4 left-4">
                        {agency.status === 'ACTIVE' ? (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                            <Bus className="h-6 w-6 text-cyan-600" />
                          </div>
                          <div className="ml-3 text-white">
                            <h3 className="text-xl font-bold">{getAgencyName(agency)}</h3>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1">{agency.rating || '4.5'}</span>
                              <span className="ml-2 opacity-90">({agency.reviewCount || '100+'} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agency Details */}
                    <div className="p-6">
                      {/* Contact Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 text-cyan-500 mr-2" />
                          <span className="text-sm">{agency.address || 'Multiple locations across Cameroon'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 text-cyan-500 mr-2" />
                          <span className="text-sm">+{agency.phoneNumber || '237 6XX XXX XXX'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 text-cyan-500 mr-2" />
                          <span className="text-sm">{agency.email || 'contact@agency.cm'}</span>
                        </div>
                      </div>

                      {/* Routes */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">Popular Routes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(agency.routes || ['Douala-Yaoundé', 'Yaoundé-Bamenda']).slice(0, 3).map((route: string, index: number) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-sm"
                            >
                              {route}
                            </span>
                          ))}
                          {(agency.routes && agency.routes.length > 3) && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                              +{agency.routes.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(agency.features || ['VIP Seats', 'WiFi Onboard', 'USB Charging']).slice(0, 3).map((feature: string, index: number) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">{agency.fleetSize || '25+'}</div>
                          <div className="text-xs text-gray-600">Buses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">{agency.yearsOperating || '10+'}</div>
                          <div className="text-xs text-gray-600">Years</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">
                            {agency.schedules ? agency.schedules.length : '4+'}
                          </div>
                          <div className="text-xs text-gray-600">Daily Trips</div>
                        </div>
                      </div>

                      {/* View More */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            License: {agency.licenseNumber || 'Pending'}
                          </span>
                          <span className="text-cyan-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">{agencies.length}+</div>
              <div className="text-xl">Verified Agencies</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-xl">Cameroonian Cities</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-xl">Average Rating</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}