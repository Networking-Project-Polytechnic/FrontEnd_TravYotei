// app/agencies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Bus, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users,
  Shield,
  CheckCircle,
  Calendar,
  Wifi,
  Coffee,
  Wind,
  CreditCard,
  Smartphone,
  Car,
  PhoneCall,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Import your API function for single agency
import { getAgencyById } from '@/lib/api';

// Create agency-specific dummy data
const getAgencyData = (userName: string) => {
  const agencyTemplates: { [key: string]: any } = {
    'amourmezam': {
      id: 1,
      firstName: "Jean",
      lastName: "Ndongo",
      userName: "amourmezam",
      email: "contact@amourmezam.cm",
      phoneNumber: 237655123456,
      address: "Mile 17 Motor Park, Douala, Cameroon",
      licenseNumber: "AMX-2023-001",
      profileImageUrl: "/api/placeholder/800/400",
      role: "AGENCY",
      status: "ACTIVE",
      rating: 4.8,
      reviewCount: 1247,
      routes: [
        { name: "Douala → Yaoundé", price: 5000, duration: "3-4h", frequency: "Every 2 hours" },
        { name: "Douala → Bafoussam", price: 6000, duration: "3h", frequency: "8 trips/day" },
        { name: "Douala → Bamenda", price: 10000, duration: "6h", frequency: "4 trips/day" },
      ],
      fleetSize: 45,
      yearsOperating: 15,
      features: [
        { name: "WiFi Onboard", icon: Wifi },
        { name: "USB Charging", icon: Smartphone },
        { name: "AC", icon: Wind },
        { name: "Snack Service", icon: Coffee },
      ],
      schedules: [
        { time: "6:00 AM", destination: "Yaoundé", available: true },
        { time: "8:00 AM", destination: "Bafoussam", available: true },
        { time: "2:00 PM", destination: "Bamenda", available: true },
        { time: "8:00 PM", destination: "Yaoundé", available: true }
      ],
      description: "Amour Mezam Express is one of Cameroon's most trusted and reliable bus companies, operating since 2008. We pride ourselves on safety, comfort, and punctuality.",
      paymentMethods: ["MTN Mobile Money", "Orange Money", "Cash", "Credit Card"]
    },
    'guaranteeexpress': {
      id: 2,
      firstName: "Marie",
      lastName: "Tchoumi",
      userName: "guaranteeexpress",
      email: "info@guarantee.cm",
      phoneNumber: 237677987654,
      address: "Nkwen Motor Park, Bamenda, Cameroon",
      licenseNumber: "GEX-2023-002",
      profileImageUrl: "/api/placeholder/800/400",
      role: "AGENCY",
      status: "ACTIVE",
      rating: 4.6,
      reviewCount: 892,
      routes: [
        { name: "Bamenda → Yaoundé", price: 8500, duration: "5-6h", frequency: "6 trips/day" },
        { name: "Bamenda → Douala", price: 10000, duration: "6h", frequency: "4 trips/day" },
        { name: "Bamenda → Buea", price: 9000, duration: "5.5h", frequency: "3 trips/day" },
      ],
      fleetSize: 32,
      yearsOperating: 12,
      features: [
        { name: "Direct Routes", icon: Car },
        { name: "Ocean Views", icon: Bus },
        { name: "Frequent Departures", icon: Clock },
        { name: "Beach Drop-off", icon: MapPin },
      ],
      schedules: [
        { time: "5:00 AM", destination: "Yaoundé", available: true },
        { time: "11:00 AM", destination: "Douala", available: true },
        { time: "4:00 PM", destination: "Buea", available: false },
        { time: "9:00 PM", destination: "Yaoundé", available: true }
      ],
      description: "Guarantee Express specializes in scenic coastal routes with comfortable buses and reliable schedules. Perfect for travelers enjoying Cameroon's beautiful landscapes.",
      paymentMethods: ["MTN Mobile Money", "Orange Money", "Cash"]
    },
    'santabarbara': {
      id: 3,
      firstName: "Paul",
      lastName: "Fokou",
      userName: "santabarbara",
      email: "reservation@santabarbara.cm",
      phoneNumber: 237690112233,
      address: "Mvan Motor Park, Yaoundé, Cameroon",
      licenseNumber: "SBB-2023-003",
      profileImageUrl: "/api/placeholder/800/400",
      role: "AGENCY",
      status: "ACTIVE",
      rating: 4.9,
      reviewCount: 1563,
      routes: [
        { name: "Yaoundé → Douala", price: 5000, duration: "3-4h", frequency: "Every hour" },
        { name: "Yaoundé → Kribi", price: 4000, duration: "2.5h", frequency: "8 trips/day" },
        { name: "Yaoundé → Bafoussam", price: 4500, duration: "3h", frequency: "6 trips/day" },
      ],
      fleetSize: 58,
      yearsOperating: 20,
      features: [
        { name: "Sleeper Seats", icon: Users },
        { name: "Overnight Service", icon: Clock },
        { name: "Security Escort", icon: Shield },
        { name: "Morning Arrival", icon: Calendar },
      ],
      schedules: [
        { time: "10:00 PM", destination: "Douala", available: true },
        { time: "11:00 PM", destination: "Kribi", available: true },
        { time: "6:00 AM", destination: "Bafoussam", available: true },
      ],
      description: "Santa Barbara offers premium overnight services with enhanced security and comfort. Our sleeper buses ensure you arrive rested and ready for your day.",
      paymentMethods: ["MTN Mobile Money", "Orange Money", "Cash", "Bank Transfer"]
    },
    'lhirondelle': {
      id: 4,
      firstName: "Chantal",
      lastName: "Ngo",
      userName: "lhirondelle",
      email: "service@lhirondelle.cm",
      phoneNumber: 237699445566,
      address: "Bonduma Park, Buea, Cameroon",
      licenseNumber: "LHL-2023-004",
      profileImageUrl: "/api/placeholder/800/400",
      role: "AGENCY",
      status: "ACTIVE",
      rating: 4.5,
      reviewCount: 987,
      routes: [
        { name: "Buea → Limbe", price: 1500, duration: "45m", frequency: "Every 30 mins" },
        { name: "Buea → Douala", price: 2500, duration: "1h", frequency: "Every hour" },
        { name: "Buea → Yaoundé", price: 6000, duration: "4h", frequency: "5 trips/day" },
      ],
      fleetSize: 28,
      yearsOperating: 10,
      features: [
        { name: "Family Packages", icon: Users },
        { name: "Child Discount", icon: Car },
        { name: "Kids Entertainment", icon: Smartphone },
        { name: "Flexible Booking", icon: CreditCard },
      ],
      schedules: [
        { time: "7:00 AM", destination: "Limbe", available: true },
        { time: "1:00 PM", destination: "Douala", available: true },
        { time: "5:00 PM", destination: "Yaoundé", available: true },
        { time: "3:00 PM", destination: "Limbe", available: false }
      ],
      description: "L'Hirondelle is the family-friendly choice for travel in Southwest Cameroon. We offer special rates for children and comfortable journeys for the whole family.",
      paymentMethods: ["MTN Mobile Money", "Orange Money", "Cash"]
    }
  };

  // Return specific agency data or a default
  return agencyTemplates[userName] || {
    id: 0,
    userName: userName,
    firstName: "Agency",
    lastName: "Manager",
    email: `contact@${userName}.cm`,
    phoneNumber: 237600000000,
    address: "Multiple locations across Cameroon",
    licenseNumber: "PENDING-001",
    rating: 4.0,
    reviewCount: 100,
    routes: [
      { name: "Main Route", price: 5000, duration: "3-4h", frequency: "Daily" }
    ],
    fleetSize: 15,
    yearsOperating: 5,
    features: [
      { name: "Basic Service", icon: Bus },
      { name: "Reliable", icon: CheckCircle }
    ],
    schedules: [
      { time: "8:00 AM", destination: "Main City", available: true }
    ],
    description: `Welcome to ${userName}, serving travelers across Cameroon with reliable transportation services.`,
    paymentMethods: ["MTN Mobile Money", "Cash"]
  };
};

export default function AgencyDetailPage() {
  const params = useParams();
  const agencyId = params.id as string;
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agencyUserName, setAgencyUserName] = useState<string>('');

  useEffect(() => {
    fetchAgency();
  }, [agencyId]);

  const fetchAgency = async () => {
    try {
      setLoading(true);
      // First, try to fetch agency data from API
      const apiData = await getAgencyById(agencyId);
      
      if (apiData && apiData.id) {
        // Use API data if available
        setAgency(apiData);
        setAgencyUserName(apiData.userName || '');
      } else {
        // If no API data, we need to get the username from somewhere
        // In a real app, you might pass this as a query param or fetch from a different endpoint
        // For now, let's assume agencyId can be mapped to username
        const username = getUsernameFromId(agencyId);
        setAgencyUserName(username);
        // Use dummy data specific to this agency
        const dummyData = getAgencyData(username);
        setAgency(dummyData);
      }
    } catch (error) {
      console.error('Error fetching agency:', error);
      // Fallback: try to get username from URL or use a default
      const username = getUsernameFromId(agencyId);
      setAgencyUserName(username);
      const dummyData = getAgencyData(username);
      setAgency(dummyData);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map ID to username
  const getUsernameFromId = (id: string): string => {
    const idToUsername: { [key: string]: string } = {
      '1': 'amourmezam',
      '2': 'guaranteeexpress',
      '3': 'santabarbara',
      '4': 'lhirondelle'
    };
    return idToUsername[id] || `agency${id}`;
  };

  if (!agency) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency not found</h2>
            <Link 
              href="/agencies" 
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              ← Back to agencies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/agencies" 
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agencies
          </Link>
        </div>
      </div>

      {/* Agency Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center">
                <Bus className="h-10 w-10 text-cyan-600" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">{agency.userName?.toUpperCase() || 'AGENCY'}</h1>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-white text-xl">{agency.rating || '4.5'}</span>
                  <span className="ml-2 text-cyan-100">({agency.reviewCount || '1000+'} reviews)</span>
                  {agency.status === 'ACTIVE' && (
                    <span className="ml-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Agency
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-6 py-3 bg-white text-cyan-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Book a Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Agency Info */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {agency.userName}</h2>
              <p className="text-gray-600 mb-6">
                {agency.description || `${agency.firstName} ${agency.lastName}'s agency has been serving Cameroonian travelers for ${agency.yearsOperating || '10+'} years.`}
              </p>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center p-4 bg-cyan-50 rounded-lg">
                  <Phone className="h-5 w-5 text-cyan-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">+{agency.phoneNumber || '237 XXX XXX XXX'}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-cyan-50 rounded-lg">
                  <Mail className="h-5 w-5 text-cyan-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{agency.email || 'contact@agency.cm'}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-cyan-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-cyan-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium">{agency.address || 'Multiple locations'}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-cyan-50 rounded-lg">
                  <Shield className="h-5 w-5 text-cyan-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">License</div>
                    <div className="font-medium">{agency.licenseNumber || 'Pending'}</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Services & Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {(agency.features || dummyAgency.features).map((feature: any, index: number) => {
                  const Icon = feature.icon || CheckCircle;
                  return (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Icon className="h-5 w-5 text-cyan-600 mr-2" />
                      <span className="text-gray-700">{feature.name || feature}</span>
                    </div>
                  );
                })}
              </div>

              {/* Payment Methods
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {(agency.paymentMethods || dummyAgency.paymentMethods).map((method: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                    {method}
                  </span>
                ))}
              </div> */}
            </div>

            {/* Routes & Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Routes & Pricing</h3>
              <div className="space-y-4">
                {(agency.routes || dummyAgency.routes).map((route: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {route.duration} • {route.frequency}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                        {route.price} FCFA
                      </div>
                      <button className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 text-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Schedules & Stats */}
          <div>
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 text-cyan-600 mr-2" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {(agency.schedules || dummyAgency.schedules).map((schedule: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{schedule.time}</div>
                      <div className="text-sm text-gray-600">{schedule.destination}</div>
                    </div>
                    {schedule.available ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Booked
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 px-4 py-3 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 font-medium">
                View Full Schedule
              </button>
            </div>

            {/* Agency Stats */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Agency Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{agency.fleetSize || '25+'}</div>
                    <div className="text-cyan-100">Buses in Fleet</div>
                  </div>
                  <Car className="h-8 w-8 opacity-80" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{agency.yearsOperating || '10+'}</div>
                    <div className="text-cyan-100">Years Operating</div>
                  </div>
                  <Shield className="h-8 w-8 opacity-80" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-cyan-100">On-time Rate</div>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{agency.reviewCount || '1000+'}</div>
                    <div className="text-cyan-100">Customer Reviews</div>
                  </div>
                  <Users className="h-8 w-8 opacity-80" />
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-6">
                Contact our support team for assistance with bookings or inquiries.
              </p>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 font-medium flex items-center justify-center">
                <PhoneCall className="h-5 w-5 mr-2" />
                Call Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}