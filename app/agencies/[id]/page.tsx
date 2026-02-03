// app/agencies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Phone, Mail, Clock, Shield,
  ArrowLeft, Info, Calendar, Briefcase, Bus
} from 'lucide-react';
import { getAgencyOverview, getAgencyById, getScheduleDetails, getSchedulesByDate, type Agency, type ScheduleDetails, type Schedule } from '@/lib/api';
import { AgencyLogo } from '@/components/AgencyLogo';

// MAPPING DES LOGOS ET PHOTOS PAR AGENCE - CHEMINS CORRIGÉS AVEC "buses"
const AGENCY_ASSETS: Record<string, { logo: string, busPhoto: string }> = {
  // Buca Voyages
  "Buca Voyages": {
    logo: "/images/agencies/logos/logobuca.jpeg",
    busPhoto: "/images/agencies/buses/busbuca.jpg"
  },
  // Cerise Voyage
  "Cerise Voyage": {
    logo: "/images/agencies/logos/logocerises.jpeg",
    busPhoto: "/images/agencies/buses/buscerise.jpg"
  },
  // Charter Voyages
  "Charter Voyages": {
    logo: "/images/agencies/logos/logocharter.jpeg",
    busPhoto: "/images/agencies/buses/buscharter.jpg"
  },
  // Finex Voyages
  "Finex Voyages": {
    logo: "/images/agencies/logos/logofinex.jpeg",
    busPhoto: "/images/agencies/buses/busfinex.jpg"
  },
  // Garanti Voyage
  "Garanti Voyage": {
    logo: "/images/agencies/logos/logogaranti.jpeg",
    busPhoto: "/images/agencies/buses/busfinex.jpg"
  },
  // General Voyage
  "General Voyage": {
    logo: "/images/agencies/logos/logogeneral.jpeg",
    busPhoto: "/images/agencies/buses/busgeneral.jpg"
  },
  // Leader Voyage
  "Leader Voyage": {
    logo: "/images/agencies/logos/logoleader.png",
    busPhoto: "/images/agencies/buses/busleader.jpg"
  },
  // Men Travel Voyage
  "Men Travel Voyage": {
    logo: "/images/agencies/logos/logomen.jpeg",
    busPhoto: "/images/agencies/buses/busmen.jpg"
  },
  // Parklane Voyages
  "Parklane Voyages": {
    logo: "/images/agencies/logos/logoparklane.png",
    busPhoto: "/images/agencies/buses/busparklan.jpg"
  },
  // Touristique Voyages
  "Touristique Voyages": {
    logo: "/images/agencies/logos/logotouristique.jpeg",
    busPhoto: "/images/agencies/buses/bustouristique.jpg"
  },
  // Transvoyages
  "Transvoyages": {
    logo: "/images/agencies/logos/logotrans.png",
    busPhoto: "/images/agencies/buses/busgeneral.jpg"
  },
  // United Voyages
  "United Voyages": {
    logo: "/images/agencies/logos/logounited.jpeg",
    busPhoto: "/images/agencies/buses/busunited.jpg"
  },

  // Aliases
  "Buca": {
    logo: "/images/agencies/logos/logobuca.jpeg",
    busPhoto: "/images/agencies/buses/busbuca.jpg"
  },
  "Cerise": {
    logo: "/images/agencies/logos/logocerises.jpeg",
    busPhoto: "/images/agencies/buses/buscerise.jpg"
  },
  "Charter": {
    logo: "/images/agencies/logos/logocharter.jpeg",
    busPhoto: "/images/agencies/buses/buscharter.jpg"
  },
  "Finex": {
    logo: "/images/agencies/logos/logofinex.jpeg",
    busPhoto: "/images/agencies/buses/busfinex.jpg"
  },
  "Garanti": {
    logo: "/images/agencies/logos/logogaranti.jpeg",
    busPhoto: "/images/agencies/buses/busfinex.jpg"
  },
  "General": {
    logo: "/images/agencies/logos/logogeneral.jpeg",
    busPhoto: "/images/agencies/buses/busgeneral.jpg"
  },
  "Leader": {
    logo: "/images/agencies/logos/logoleader.png",
    busPhoto: "/images/agencies/buses/busleader.jpg"
  },
  "Men Travel": {
    logo: "/images/agencies/logos/logomen.jpeg",
    busPhoto: "/images/agencies/buses/busmen.jpg"
  },
  "Parklane": {
    logo: "/images/agencies/logos/logoparklane.png",
    busPhoto: "/images/agencies/buses/busparklan.jpg"
  },
  "Touristique": {
    logo: "/images/agencies/logos/logotouristique.jpeg",
    busPhoto: "/images/agencies/buses/bustouristique.jpg"
  },
  "Trans": {
    logo: "/images/agencies/logos/logotrans.png",
    busPhoto: "/images/agencies/buses/busgeneral.jpg"
  },
  "United": {
    logo: "/images/agencies/logos/logounited.jpeg",
    busPhoto: "/images/agencies/buses/busunited.jpg"
  }
};

// Types pour le planning
interface ScheduleDay {
  date: string;
  dayName: string;
  trips: Trip[];
}

interface Trip {
  id: string;
  time: string;
  destination: string;
  priceType: 'standard' | 'vip' | 'premium';
  price: number;
  availableSeats: number;
  bus: {
    model: string;
    plateNumber: string;
    amenities: string[];
  };
  driver: {
    name: string;
    photo: string;
    experience: string;
  };
  stops: string[];
  duration: string;
  galleryImages: string[];
}

// Feature translation mapping
const FEATURE_TRANSLATIONS: Record<string, string> = {
  'WiFi haute vitesse': 'High-speed WiFi',
  'Climatisation': 'Air Conditioning',
  'Service 24h/24': '24/7 Service',
  'Bagages inclus': 'Baggage included',
  'Chargement USB': 'USB Charging',
  'Service VIP': 'VIP Service',
  'Service sur place': 'On-site Service',
  'Réservation en ligne': 'Online Reservation',
  'Service touristique': 'Tourist Service',
  'Grande capacité': 'High Capacity',
  'Prix économique': 'Economy Price',
  'Service national': 'National Service',
  'Expérience': 'Experience',
  'Service Mvan': 'Mvan Service',
  'Innovation': 'Innovation',
  'Service international': 'International Service',
  'Service corporatif': 'Corporate Service',
  'Eau minérale': 'Mineral Water',
  'Sièges inclinables': 'Reclining Seats',
  'Repas léger': 'Light Meal',
  'Guide local': 'Local Guide',
  'Confort moderne': 'Modern Comfort',
  'Haute qualité': 'High Quality',
  'Tradition': 'Tradition',
  'Service client': 'Customer Service'
};

const translateFeature = (feature: string) => FEATURE_TRANSLATIONS[feature] || feature;

// Fonction pour obtenir les assets d'une agence
const getAgencyAssets = (agencyName: string) => {
  if (!agencyName) return { logo: null, busPhoto: null };

  const name = agencyName.toLowerCase().trim();

  // Cherche une correspondance exacte
  for (const [key, assets] of Object.entries(AGENCY_ASSETS)) {
    if (name === key.toLowerCase()) {
      return assets;
    }
  }

  // Cherche une correspondance partielle
  for (const [key, assets] of Object.entries(AGENCY_ASSETS)) {
    if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
      return assets;
    }
  }

  // Cherche par mot clé
  const keywords = Object.keys(AGENCY_ASSETS).filter(k => k.length <= 20);
  for (const keyword of keywords) {
    if (name.includes(keyword.toLowerCase())) {
      return AGENCY_ASSETS[keyword];
    }
  }

  return { logo: null, busPhoto: null };
};

// Local components removed in favor of shared AgencyLogo

// Composant Bus Photo avec fallback - POUR TOUTE L'AGENCE
const AgencyBusPhoto = ({ agencyName, className = "" }: { agencyName: string; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  const assets = getAgencyAssets(agencyName);

  if (!assets.busPhoto || imageError) {
    return (
      <div className={`${className} bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center`}>
        <Bus className="h-20 w-20 text-white" />
      </div>
    );
  }

  return (
    <img
      src={assets.busPhoto}
      alt={`Bus de ${agencyName}`}
      className={`${className} object-cover rounded-lg`}
      onError={() => setImageError(true)}
    />
  );
};

// Fonction pour générer des voyages pour une date spécifique
const generateTripsForDate = (agency: Agency, date: Date): ScheduleDay => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const formattedDate = date.toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dayName = dayNames[date.getDay()];
  if (diffDays === 0) dayName = "Today";
  else if (diffDays === 1) dayName = "Tomorrow";

  const trips: Trip[] = (agency.routes || []).slice(0, 4).map((route, index) => {
    const times = ['6:00', '8:00', '14:00', '20:00'];
    const priceType = ['standard', 'vip', 'premium'][index % 3] as 'standard' | 'vip' | 'premium';

    return {
      id: `${agency.id}_${formattedDate}_${index}`,
      time: times[index],
      destination: route.name.split('→')[1]?.trim() || route.name,
      priceType,
      price: priceType === 'standard' ? route.standardPrice :
        priceType === 'vip' ? route.vipPrice : route.premiumPrice,
      availableSeats: Math.floor(Math.random() * 20) + 5,
      bus: {
        model: ['Volvo B8R 2023', 'Mercedes Sprinter 2024', 'Toyota Coaster'][index % 3],
        plateNumber: `CM-${String.fromCharCode(65 + index)}${String.fromCharCode(65 + (date.getDay() % 26))}-${100 + index}`,
        amenities: ['WiFi', 'USB Charging', 'AC', 'TV', 'Toilet']
      },
      driver: {
        name: ['Jean Abena', 'Samuel Tchoumi', 'Martine Ngono'][index % 3],
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agency.id}_${index}`,
        experience: `${5 + index} years experience`
      },
      stops: ['Yaoundé Centre', 'Intermediate Stop', route.name.split('→')[1]?.trim() || 'Destination'],
      duration: route.duration,
      galleryImages: [
        getAgencyAssets(agency.userName).busPhoto || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1562620644-65bb403e6fb2?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=1000"
      ]
    };
  });

  return {
    date: formattedDate,
    dayName,
    trips
  };
};

const generateInitialSchedule = (agency: Agency): ScheduleDay[] => {
  const schedule: ScheduleDay[] = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    schedule.push(generateTripsForDate(agency, date));
  }
  return schedule;
};

export default function AgencyDetailPage() {
  const params = useParams();
  // State for agency data and overview
  const [agency, setAgency] = useState<Agency | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function initAgency() {
      const agencyId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!agencyId) return;

      try {
        const data = await getAgencyById(agencyId as string);
        if (data) {
          setAgency(data);
        }
      } catch (error) {
        console.error('Error fetching agency:', error);
      } finally {
        setLoading(false);
      }
    };

    initAgency();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center group">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl flex items-center justify-center mb-6 animate-pulse group-hover:scale-110 transition-transform">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Agency Profile...</div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center bg-gray-50 dark:bg-slate-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-2xl">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Info className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 uppercase">Agency Not Found</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 font-medium">Sorry, we couldn't find the details for this agency.</p>
          <Link href="/agencies" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-xl shadow-cyan-500/20">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Agencies
          </Link>
        </div>
      </div>
    );
  }

  const agencyName = `${agency.firstName} ${agency.lastName}`;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 pb-20 font-['Poppins',sans-serif]">
      {/* Navigation */}
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/agencies" className="group inline-flex items-center text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">
            <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to exploration
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-cyan-600 to-blue-700 dark:from-slate-900 dark:to-slate-950 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent dark:from-cyan-500/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] border-4 border-white/10 dark:border-slate-800 shadow-2xl">
                <AgencyLogo
                  agencyName={agencyName}
                  profileImageUrl={agency.profileImageUrl}
                  className="w-32 h-32 sm:w-48 sm:h-48 rounded-[2rem] object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  {agency.role || 'Transport Agency'}
                </span>
                <span className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30 flex items-center gap-2">
                  <Shield className="h-3 w-3" /> Verified Partner
                </span>
              </div>
              <h1 className="text-4xl sm:text-7xl font-bold text-white tracking-tight leading-tight mb-4">
                {agencyName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-cyan-100/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium">{agency.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium">License: {agency.licenseNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-100 dark:border-slate-800 px-6 pt-6 sm:px-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-5 text-sm font-bold transition-all relative ${activeTab === tab.id
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 sm:p-14">
            {activeTab === 'overview' && (
              <div className="max-w-3xl animate-in fade-in slide-in-from-left-4 duration-500">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">About {agencyName}</h2>
                <div className="space-y-6 text-gray-600 dark:text-slate-400 leading-relaxed text-lg">
                  <p className="font-medium italic text-cyan-600 dark:text-cyan-400 opacity-80 border-l-4 border-cyan-500 pl-6 py-2">
                    "{agency.bio || 'Providing quality transport services for all your travel needs.'}"
                  </p>
                  <p>
                    Experience the comfort and reliability of one of the leading transport agencies in the region. We are committed to providing the safest and most efficient travel solutions for our valued customers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 bg-gray-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 group hover:border-cyan-500/30 transition-colors">
                    <Clock className="h-8 w-8 text-cyan-500 mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Availability</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Regular departures across major regional routes.</p>
                  </div>
                  <div className="p-8 bg-gray-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 group hover:border-cyan-500/30 transition-colors">
                    <Shield className="h-8 w-8 text-cyan-500 mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Safety First</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Fully licensed and inspected fleet for your peace of mind.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-cyan-50 dark:bg-cyan-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Calendar className="h-10 w-10 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Official Schedule Coming Soon</h3>
                <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                  We are currently updating our digital schedule to provide real-time trip information. Please check back later or contact for inquiries.
                </p>
                <Link href="/agencies" className="mt-10 inline-flex items-center px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95">
                  Browse other agencies
                </Link>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Briefcase className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h3>
                <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                  We are finalising our service catalogue for online viewing. This will include VIP, Premium, and Standard options.
                </p>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Contact Information</h2>

                  <div className="p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-cyan-500">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Direct Line</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{agency.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-cyan-500">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Official Email</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight break-all">{agency.email}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-cyan-500">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Headquarters</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{agency.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-800 dark:to-slate-900 rounded-[3.5rem] p-12 text-white flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-cyan-500/20 transition-all duration-1000" />

                  <Shield className="h-16 w-16 text-cyan-400 mb-8 relative z-10" />
                  <h3 className="text-3xl font-bold mb-6 tracking-tight relative z-10 italic">Secure & Verified</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-10 relative z-10">
                    This agency is part of our Verified Partner Network. All travel data and transactions are protected under our Secure Booking system.
                  </p>
                  <div className="pt-10 border-t border-white/10 relative z-10">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-cyan-400/60 mb-2">Legal Identity</p>
                    <p className="text-2xl font-bold italic tracking-tighter uppercase">{agency.userName}</p>
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