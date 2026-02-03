// app/agencies/[id]/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Bus, Star, MapPin, Phone, Mail, Clock, Users,
  Shield, CheckCircle, Calendar, Wifi, Coffee,
  Wind, Car, PhoneCall, ArrowLeft, X, User,
  Map, ChevronRight, Check, Battery, Tv, Music,
  Thermometer, Luggage, AlertCircle, DollarSign,
  Globe, Home, Building, Crown, Zap, Award,
  ExternalLink, Smartphone, CreditCard, LayoutGrid
} from 'lucide-react';
import { getAgencyOverview, getAgencyById, getScheduleDetails, getSchedulesByDate, type Agency, type ScheduleDetails, type Schedule } from '@/lib/api';
import { BusSeatSimulation } from '@/components/BusSeatSimulation';
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

  const trips: Trip[] = agency.routes.slice(0, 4).map((route, index) => {
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

  // Modals and UI state
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isBookingSeat, setIsBookingSeat] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<Record<string, string[]>>({}); // tripId -> seatIds
  const [tempSelectedSeat, setTempSelectedSeat] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState<string | null>(null); // seat number

  const initialOccupiedSeatsForTrip = useMemo(() => {
    if (!selectedTrip) return [];
    const total = 64;
    const available = selectedTrip.availableSeats;
    const occupiedCount = total - available;
    const seats = [];
    // Remplir de manière déterministe pour que ça ne change pas à chaque clic
    for (let i = 0; i < occupiedCount; i++) {
      const row = Math.floor(i / 4) + 1;
      const col = String.fromCharCode(65 + (i % 4));
      seats.push(`${row}${col}`);
    }
    return seats;
  }, [selectedTrip?.id]); // On recalcule seulement si l'ID du voyage change

  // Mapping Backend -> UI
  const mapScheduleToTrip = (details: ScheduleDetails): Trip => {
    // Map backend bus type to UI priceType
    let pType: 'standard' | 'vip' | 'premium' = 'standard';
    const typeLower = (details.busTypeName || '').toLowerCase();
    if (typeLower.includes('vip')) pType = 'vip';
    else if (typeLower.includes('premium')) pType = 'premium';

    return {
      id: details.scheduleid,
      time: details.departuretime,
      destination: details.endLocation?.locationname || 'Unknown',
      availableSeats: details.bus?.totalSeats || 50,
      price: details.price?.priceAmount || 0,
      priceType: pType,
      duration: details.route?.stopPoints ? `${details.route.stopPoints.length} stops` : '3-4h',
      driver: {
        name: details.driver?.fullName || 'TBD',
        experience: details.driver?.description || 'Experienced Driver',
        photo: details.driverImages?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      },
      bus: {
        model: details.busModelName || details.bus?.registrationNumber || 'Modern Coach',
        plateNumber: details.bus?.registrationNumber || 'N/A',
        amenities: details.bus?.amenities?.map(a => a.amenityName) || ['A/C', 'Standard Seats'],
      },
      galleryImages: details.busImages?.length > 0
        ? details.busImages.map(img => img.imageUrl)
        : ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200'],
      stops: [
        details.startLocation?.locationname || 'Departure',
        ...(details.route?.stopPoints || []),
        details.endLocation?.locationname || 'Destination'
      ]
    };
  };

  useEffect(() => {
    async function initAgency() {
      const agencyId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!agencyId) return;

      try {
        setLoading(true);
        console.log(`[DEBUG] Initializing agency with ID: ${agencyId}`);

        // 1. Fetch agency info (has mock fallback in getAgencyById)
        let agencyData = await getAgencyById(agencyId);
        if (!agencyData && agencyId === '00000000-0000-0000-0000-000000000000') {
          // Double check if we can get it as the first mock if not found by ID
          agencyData = await getAgencyById('1'); // Generic fallback
        }
        setAgency(agencyData);

        if (agencyData) {
          // Initialize empty schedule days for 3 days
          const initialDays = generateInitialSchedule(agencyData);
          setScheduleDays(initialDays);

          try {
            // 2. Try fetching real overview
            const overviewData = await getAgencyOverview(agencyId);
            console.log('[DEBUG] Real Agency Overview JSON:', overviewData);
            setOverview(overviewData);

            // 3. Try fetching real schedules for today
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const daySchedules = await getSchedulesByDate(dateStr);
            console.log(`[DEBUG] Real Schedules for ${dateStr}:`, daySchedules);

            const agencySchedules = daySchedules.filter(s => s.agencyid === agencyId);

            if (agencySchedules.length > 0) {
              const fullTripDetails = await Promise.all(
                agencySchedules.map(async (s) => {
                  try {
                    return await getScheduleDetails(s.scheduleid);
                  } catch (e) {
                    console.error(`Failed to fetch details for schedule ${s.scheduleid}`, e);
                    return null;
                  }
                })
              );

              const validDetails = fullTripDetails.filter(d => d !== null);

              if (validDetails.length > 0) {
                setScheduleDays(prev => {
                  const updated = [...prev];
                  if (updated[0]) {
                    updated[0].trips = validDetails.map(mapScheduleToTrip);
                  }
                  return updated;
                });
              }
            }
          } catch (apiErr) {
            console.warn("API Error (Real data unavailable), staying with dummy schedules:", apiErr);
          }
        }
      } catch (err) {
        console.error("Critical failure loading agency:", err);
      } finally {
        setLoading(false);
      }
    }
    initAgency();
  }, [params.id]);

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const agencyId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!newDate || !agencyId) return;

    try {
      const dateObj = new Date(newDate);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      const daySchedules = await getSchedulesByDate(newDate);
      console.log(`[DEBUG] New Date Schedules for ${newDate} JSON:`, daySchedules);

      const agencySchedules = daySchedules.filter(s => s.agencyid === agencyId);

      const detailedTrips = await Promise.all(
        agencySchedules.map(async (s) => {
          const details = await getScheduleDetails(s.scheduleid);
          console.log(`[DEBUG] New Date Schedule Details for ${s.scheduleid} JSON:`, details);
          return details;
        })
      );

      const newDay: ScheduleDay = {
        date: newDate,
        dayName: dayName,
        trips: detailedTrips.map(mapScheduleToTrip)
      };

      setScheduleDays(prev => {
        const filtered = prev.filter(d => d.date !== newDate);
        return [newDay, ...filtered].slice(0, 5);
      });
      setSelectedDayIndex(0);
    } catch (err) {
      console.error("Failed to fetch schedules for date:", err);
    }
  };

  const handleDeleteHistory = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (scheduleDays.length <= 1) return; // Keep at least one

    setScheduleDays(prev => {
      const newList = prev.filter((_, i) => i !== index);
      // Adjust selected index if needed
      if (selectedDayIndex >= index && selectedDayIndex > 0) {
        setSelectedDayIndex(prevIdx => prevIdx - 1);
      } else if (selectedDayIndex >= newList.length) {
        setSelectedDayIndex(newList.length - 1);
      }
      return newList;
    });
  };

  // Fonction pour gérer le clic sur un voyage
  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setActiveImgIndex(0);
  };

  // Fonction pour obtenir l'icône d'un service
  const getFeatureIcon = (feature: string) => {
    const icons: Record<string, any> = {
      'WiFi': <Wifi className="h-4 w-4" />,
      'Wi-Fi': <Wifi className="h-4 w-4" />,
      'WiFi haute vitesse': <Wifi className="h-4 w-4" />,
      'Climatisation': <Thermometer className="h-4 w-4" />,
      'Service 24h/24': <Clock className="h-4 w-4" />,
      'Bagages inclus': <Luggage className="h-4 w-4" />,
      'Chargement USB': <Battery className="h-4 w-4" />,
      'Service VIP': <Crown className="h-4 w-4" />,
      'Service sur place': <Home className="h-4 w-4" />,
      'Réservation en ligne': <Smartphone className="h-4 w-4" />,
      'Service touristique': <Globe className="h-4 w-4" />,
      'Grande capacité': <Users className="h-4 w-4" />,
      'Prix économique': <DollarSign className="h-4 w-4" />,
      'Service national': <Globe className="h-4 w-4" />,
      'Expérience': <Award className="h-4 w-4" />,
      'Service Mvan': <Building className="h-4 w-4" />,
      'Innovation': <Zap className="h-4 w-4" />,
      'Service international': <Globe className="h-4 w-4" />,
      'Service corporatif': <Building className="h-4 w-4" />,
      'Eau minérale': <Coffee className="h-4 w-4" />,
      'Sièges inclinables': <Users className="h-4 w-4" />,
      'Repas léger': <Coffee className="h-4 w-4" />,
      'Guide local': <User className="h-4 w-4" />,
      'Confort moderne': <Users className="h-4 w-4" />,
      'Haute qualité': <Award className="h-4 w-4" />,
      'Tradition': <Shield className="h-4 w-4" />,
      'Service client': <PhoneCall className="h-4 w-4" />
    };

    return icons[feature] || <CheckCircle className="h-4 w-4" />;
  };

  // Fonction pour obtenir la couleur selon le type de prix
  const getPriceTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center group">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg flex items-center justify-center mb-6 animate-pulse group-hover:scale-110 transition-transform">
            <Bus className="h-12 w-12 text-cyan-500 animate-bounce" />
          </div>
          <div className="text-gray-400 font-black uppercase tracking-widest text-xs">Analyzing trip...</div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center bg-gray-50 dark:bg-slate-900 p-12 rounded-3xl border border-gray-100 dark:border-slate-800">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">Agency not found</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8">Sorry, we can&apos;t find the details for this agency.</p>
          <Link href="/agencies" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all ">
            ← Back to agencies
          </Link>
        </div>
      </div>
    );
  }

  const agencyName = agency.displayName || agency.userName;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Modal détails voyage */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[60] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-full sm:max-h-[95vh] overflow-y-auto rounded-none sm:rounded-lg border-x sm:border border-gray-100 dark:border-slate-800 relative flex flex-col">

            {/* Top Bar: Navigation & Thumbnails */}
            <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex flex-col">
              <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Close Gallery
                </button>
                <div className="flex gap-2">
                  {selectedTrip.galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIndex(i)}
                      className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${activeImgIndex === i
                        ? 'border-cyan-500 scale-105 shadow-sm'
                        : 'border-transparent opacity-40 hover:opacity-100'
                        }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Gallery Area */}
            <div className="relative h-[400px] sm:h-[500px] bg-black overflow-hidden group/gallery flex-shrink-0">
              <div className="absolute inset-0 transition-opacity duration-700">
                <img
                  src={selectedTrip.galleryImages[activeImgIndex]}
                  className="w-full h-full object-cover"
                  alt={`View ${activeImgIndex + 1}`}
                />
              </div>

              {/* High-Clarity Navigation Controls */}
              {selectedTrip.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev === 0 ? selectedTrip.galleryImages.length - 1 : prev - 1))}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 dark:bg-slate-900/90 shadow-xl flex items-center justify-center rounded-full text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all z-10"
                  >
                    <ChevronRight className="h-6 w-6 rotate-180" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev === selectedTrip.galleryImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 dark:bg-slate-900/90 shadow-xl flex items-center justify-center rounded-full text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all z-10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Essential Info Section: Below Image */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 border-b border-gray-100 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-md">
                      {selectedTrip.priceType} CLASS
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedTrip.duration} JOURNEY
                    </span>
                  </div>
                  <h3 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none mb-6">
                    {selectedTrip.destination}
                  </h3>
                  <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-100 dark:border-slate-800 w-fit">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Departure</span>
                      <span className="text-3xl font-black text-gray-900 dark:text-white italic">{selectedTrip.time}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-200 dark:bg-slate-700"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-xs font-black text-emerald-500 uppercase flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        ON TIME
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-slate-900 dark:bg-slate-800 p-10 rounded-lg text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard className="w-20 h-20 rotate-12" />
                  </div>
                  <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-2 italic">Standard Price</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl font-black italic tracking-tighter">{selectedTrip.price}</span>
                    <span className="text-sm font-bold opacity-40 uppercase tracking-widest">FCFA</span>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Available Seats</span>
                      <span className="text-xs font-black text-emerald-400">{selectedTrip.availableSeats} LEFT</span>
                    </div>
                    <button
                      onClick={() => setIsBookingSeat(true)}
                      className="w-full h-16 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-cyan-900/40 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Zap className="h-4 w-4" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-16">
              {/* Info Grid: Driver & Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-gray-50 dark:bg-slate-800/40 rounded-lg border border-gray-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 italic">Assigned Pilot</h4>
                  <div className="flex items-center">
                    <img src={selectedTrip.driver.photo} alt="" className="w-20 h-20 rounded-lg object-cover grayscale" />
                    <div className="ml-6">
                      <div className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">{selectedTrip.driver.name}</div>
                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{selectedTrip.driver.experience}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50 dark:bg-slate-800/40 rounded-lg border border-gray-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 italic">Vehicle Details</h4>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-slate-700">
                      <Bus className="h-8 w-8 text-cyan-500" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">{selectedTrip.bus.model}</div>
                      <code className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedTrip.bus.plateNumber}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities List - Minimalist */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 italic text-center">Comfort & Equipment</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedTrip.bus.amenities.map((amenity, index) => (
                    <div key={index} className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-lg flex items-center gap-3">
                      <div className="text-cyan-500">{getFeatureIcon(amenity)}</div>
                      <span className="text-[10px] font-black text-gray-600 dark:text-slate-300 uppercase tracking-widest">{translateFeature(amenity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary Path - Minimalist */}
              <div className="max-w-xl mx-auto py-12">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12 italic text-center">Journey Timeline</h4>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-slate-800"></div>
                  <div className="space-y-12">
                    {selectedTrip.stops.map((stop, index) => (
                      <div key={index} className="flex items-start relative gap-8 pl-10">
                        <div className={`absolute left-2.5 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 z-10 ${index === 0 ? 'bg-cyan-500' :
                          index === selectedTrip.stops.length - 1 ? 'bg-emerald-500' :
                            'bg-gray-300 dark:bg-slate-700'
                          }`}></div>
                        <div>
                          <p className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">{stop}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {index === 0 ? 'Initial Departure' :
                              index === selectedTrip.stops.length - 1 ? 'Final Arrival Point' :
                                'Scheduled Stop'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal planning complet sur 3 jours */}
      {showFullSchedule && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 px-8 py-6 flex justify-between items-center z-10 flex-shrink-0">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Full Schedule - {agency.userName}</h2>
              <button onClick={() => setShowFullSchedule(false)} className="p-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-lg transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row min-h-0">
              {/* Left Side: Date Picker and Day Selector */}
              <div className="w-full sm:w-72 md:w-80 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-slate-800 p-6 sm:p-8 overflow-y-auto bg-gray-50 dark:bg-slate-800/30">
                <div className="mb-8">
                  <label htmlFor="custom-date" className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Pick travel date</label>
                  <input
                    id="custom-date"
                    type="date"
                    defaultValue={scheduleDays[selectedDayIndex]?.date || new Date().toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">History/Quick Select</p>
                  {scheduleDays.map((day, idx) => (
                    <div key={idx} className="relative group/item">
                      <button
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`w-full px-4 py-4 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex flex-col items-start transform ${selectedDayIndex === idx
                          ? 'bg-slate-900 text-white dark:bg-cyan-600 scale-[1.02]'
                          : 'bg-white dark:bg-slate-800 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        <span>{day.dayName}</span>
                        <span className={`mt-1 font-bold opacity-60 ${selectedDayIndex === idx ? 'text-white' : 'text-gray-400'}`}>{day.date}</span>
                      </button>

                      {scheduleDays.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteHistory(e, idx)}
                          className={`absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-md transition-all duration-200 ${selectedDayIndex === idx
                            ? 'text-white/40 hover:text-white hover:bg-white/10'
                            : 'text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                            }`}
                          title="Remove from history"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Schedule Results */}
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-white dark:bg-slate-900">
                {scheduleDays[selectedDayIndex] ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                      <div>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">
                          {scheduleDays[selectedDayIndex].dayName} Departures
                        </h3>
                        <p className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                          {scheduleDays[selectedDayIndex].trips.length} AVAILABLE TRIPS FOUND
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                        <Calendar className="h-4 w-4 text-cyan-500" />
                        <span className="text-sm font-black text-gray-900 dark:text-white italic">{scheduleDays[selectedDayIndex].date}</span>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-slate-800">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                            <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Time</th>
                            <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Destination</th>
                            <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Class</th>
                            <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Fare</th>
                            <th className="py-6 px-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduleDays[selectedDayIndex].trips.map((trip, tripIndex) => (
                            <tr
                              key={tripIndex}
                              onClick={() => handleTripClick(trip)}
                              className="group border-b border-gray-50 dark:border-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-all cursor-pointer"
                            >
                              <td className="py-7 px-8">
                                <span className="font-black text-2xl text-gray-900 dark:text-white italic tracking-tighter group-hover:text-cyan-600 transition-colors uppercase">{trip.time}</span>
                              </td>
                              <td className="py-7 px-8">
                                <div className="font-black text-gray-900 dark:text-white uppercase text-base tracking-tight">{trip.destination}</div>
                                <div className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">Est. {trip.duration} voyage</div>
                              </td>
                              <td className="py-7 px-8">
                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriceTypeColor(trip.priceType)}`}>
                                  {trip.priceType}
                                </span>
                              </td>
                              <td className="py-7 px-8">
                                <div className="font-black text-xl text-gray-900 dark:text-white italic tracking-tighter">{trip.price} <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">f</span></div>
                              </td>
                              <td className="py-7 px-8 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTripClick(trip);
                                  }}
                                  className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white group-hover:bg-cyan-600 transition-all rounded-lg font-black text-[9px] uppercase tracking-widest"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-12 p-8 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-100 dark:border-slate-800 border-dashed">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Standard</p>
                          <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Comfortable seating, WiFi and AC included.</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-purple-600 mb-2">Prestige VIP</p>
                          <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Reclining seats, USB charging, priority check-in.</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Premium</p>
                          <p className="text-[10px] text-gray-500 font-bold leading-relaxed">180° beds, in-flight meals, exclusive cabin.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Calendar className="h-16 w-16 text-gray-200 mb-6" />
                    <h3 className="text-xl font-black text-gray-300 uppercase italic">No trips found</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Try selecting another date on the left</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SÉLECTION DE SIÈGE 3D + PAIEMENT SIMULÉ */}
      {isBookingSeat && selectedTrip && (
        <div className="fixed inset-0 bg-slate-950/95 z-[70] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full h-full sm:max-w-6xl sm:max-h-[90vh] sm:rounded-3xl border border-slate-800 flex flex-col overflow-hidden  relative">
            {/* Bouton Fermer */}
            <button
              onClick={() => {
                setIsBookingSeat(false);
                setTempSelectedSeat(null);
              }}
              className="absolute top-6 right-6 z-50 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header info */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none"></div>

              <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                <Bus className="h-6 w-6 text-cyan-500" />
                SEAT SELECTION
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-slate-400 text-xs">Dest: <span className="text-white font-bold">{selectedTrip.destination}</span></span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="text-slate-400 text-xs">Departure: <span className="text-white font-bold">{selectedTrip.time}</span></span>
              </div>
            </div>

            {/* Main Content Area: Split View */}
            <div className="flex-1 flex flex-col sm:flex-row min-h-0 relative overflow-hidden">
              {/* Left Side: Seat Selection (The Bus) */}
              <div className="flex-1 relative bg-slate-950 min-h-0">
                <BusSeatSimulation
                  totalSeats={64}
                  occupiedSeats={[
                    ...initialOccupiedSeatsForTrip,
                    ...(bookedSeats[selectedTrip.id] || [])
                  ]}
                  onSeatSelect={(seatId: any) => setTempSelectedSeat(seatId)}
                />
              </div>

              {/* Right Side: Payment Panel */}
              {tempSelectedSeat && (
                <div className="w-full sm:w-72 md:w-80 border-t sm:border-t-0 sm:border-l border-slate-800 bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto flex-shrink-0 animate-in slide-in-from-right-full duration-500 z-50">
                  <div className="flex flex-col h-full min-h-fit">
                    <div className="mb-6">
                      <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Confirmation</p>
                      <div className="flex justify-between items-end">
                        <p className="text-5xl font-black text-white italic tracking-tighter">#{tempSelectedSeat}</p>
                        <div className="text-right pb-1">
                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Fare</p>
                          <p className="text-xl font-black text-white">{selectedTrip.price} F</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/40 rounded-lg border border-white/5 space-y-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                          <span>Service</span>
                          <span className="text-white">{selectedTrip.priceType}</span>
                        </div>
                        <div className="h-px bg-white/5 w-full"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-slate-500 uppercase font-black">Payment through</span>
                            <span className="text-xs text-white font-bold">Orange Money</span>
                          </div>
                          <div className="w-4 h-4 rounded-full border-4 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"></div>
                        </div>
                      </div>

                      <button
                        disabled={isProcessingPayment}
                        onClick={() => {
                          setIsProcessingPayment(true);
                          setTimeout(() => {
                            setBookedSeats(prev => ({
                              ...prev,
                              [selectedTrip.id]: [...(prev[selectedTrip.id] || []), tempSelectedSeat]
                            }));
                            setIsProcessingPayment(false);
                            const confirmedSeat = tempSelectedSeat;
                            setTempSelectedSeat(null);
                            setShowBookingSuccess(confirmedSeat);
                          }, 2000);
                        }}
                        className="w-full h-16 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all  disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {isProcessingPayment ? (
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          "Confirm Purchase"
                        )}
                      </button>

                      <p className="text-[9px] text-center text-slate-500 font-medium leading-relaxed px-2">
                        Secure payment. Your ticket will be generated immediately after validation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RÉUSSITE PREMIUM */}
      {showBookingSuccess && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-slate-900 border border-emerald-500/30 w-full max-w-md p-8 rounded-lg shadow-[0_0_100px_rgba(16,185,129,0.2)] text-center relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>

              <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">PAYMENT SUCCESSFUL !</h2>
              <div className="text-emerald-400 font-bold tracking-widest text-[10px] uppercase mb-6 flex items-center justify-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                Transaction Confirmed
                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              </div>

              <div className="py-6 border-y border-white/5 mb-8">
                <p className="text-slate-400 text-sm mb-1">Your seat is reserved</p>
                <p className="text-5xl font-black text-white italic tracking-tighter">SEAT #{showBookingSuccess}</p>
                <p className="text-slate-500 text-[10px] mt-4 uppercase font-medium font-bold italic tracking-tight">Have a nice trip with TravYotei !</p>
              </div>

              <button
                onClick={() => {
                  setShowBookingSuccess(null);
                  setIsBookingSeat(false);
                }}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-black uppercase text-sm tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/agencies" className="group inline-flex items-center text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">
            <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to exploration
          </Link>
        </div>
      </div>

      {/* Bannière agence */}
      <div className="relative bg-gradient-to-br from-cyan-600 to-blue-700 dark:from-slate-900 dark:to-slate-950 py-16 overflow-hidden border-b border-gray-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent dark:from-cyan-500/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white dark:bg-slate-900 p-2 rounded-3xl border-4 border-white/10 dark:border-slate-800 ">
                  <AgencyLogo agencyName={agencyName} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg" />
                </div>
              </div>

              <div className="ml-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                    {agency.type}
                  </span>
                  {agency.rating >= 4.8 && (
                    <span className="px-3 py-1 bg-amber-500 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] ">
                      Top Rated
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">{agencyName}</h1>
                <div className="flex flex-wrap items-center mt-4 gap-6">
                  <div className="flex items-center px-4 py-2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-white font-black text-xl">{agency.rating}</span>
                    <span className="ml-2 text-white/60 font-medium tracking-tight">({agency.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-white/80 font-bold tracking-tight">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 border border-white/20">
                      <Clock className="h-5 w-5 text-cyan-300" />
                    </div>
                    {agency.serviceHours}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <button
                onClick={() => {
                  const schedule = document.getElementById('daily-schedule');
                  schedule?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 bg-white dark:bg-cyan-500 text-slate-900 dark:text-white font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:brightness-110 shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] active:scale-95 transition-all text-center"
              >
                Plan a trip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-10 border border-gray-100 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building className="w-32 h-32 text-cyan-500" />
              </div>
              <h2 className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em] mb-4 italic">Identity & Vision</h2>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight mb-6 uppercase">About {agencyName}</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-10 leading-relaxed text-lg font-medium">{agency.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group flex items-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-cyan-500 transition-all duration-300">
                  <div className="w-14 h-14 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center mr-6  group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-cyan-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Direct Contact</div>
                    <div className="font-black text-gray-900 dark:text-white italic tracking-tight text-xl">{agency.phoneNumber}</div>
                  </div>
                </div>
                <div className="group flex items-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-cyan-500 transition-all duration-300">
                  <div className="w-14 h-14 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center mr-6  group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-cyan-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Location</div>
                    <div className="font-black text-gray-900 dark:text-white italic tracking-tight text-lg">{agency.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Routes avec 3 types de prix */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-10 border border-gray-100 dark:border-slate-800">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em] mb-4 italic">Flexible Pricing</h2>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight uppercase">Routes and Travel Classes</h3>
              </div>

              <div className="space-y-12">
                {agency.routes.map((route, index) => (
                  <div key={index} className="group overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-gray-50 dark:border-slate-800 pb-4">
                      <div>
                        <h3 className="font-black text-2xl text-gray-900 dark:text-white italic tracking-tighter uppercase">{route.name}</h3>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mt-2">
                          <span className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                            <Clock className="h-3 w-3 text-cyan-500" />
                            {route.duration}
                          </span>
                          <span className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                            <Zap className="h-3 w-3 text-cyan-500" />
                            {route.frequency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Standard */}
                      <div className="relative bg-gray-50 dark:bg-slate-800/40 rounded-lg p-8 border border-gray-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 italic tracking-tighter">STANDARD</div>
                        </div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white mb-6 italic tracking-tighter">
                          {route.standardPrice} <span className="text-xs font-bold uppercase tracking-widest text-gray-400">f</span>
                        </div>
                        <ul className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 space-y-3 mb-8">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Classic Seat
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-gray-300 dark:text-slate-600" />
                            WiFi Included
                          </li>
                        </ul>
                        <button className="w-full py-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-slate-600 transition-all active:scale-95">
                          SELECT
                        </button>
                      </div>

                      {/* VIP */}
                      <div className="relative bg-purple-500/5 dark:bg-purple-500/10 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-500/30 shadow-xl shadow-purple-500/5 hover:border-purple-500 transition-all duration-300">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-purple-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                          RECOMMENDED
                        </div>
                        <div className="flex justify-between items-start mb-6 text-purple-600 dark:text-purple-400">
                          <div className="text-2xl font-black italic tracking-tighter">PRESTIGE VIP</div>
                        </div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white mb-6 italic tracking-tighter">
                          {route.vipPrice} <span className="text-xs font-bold uppercase tracking-widest text-gray-400">f</span>
                        </div>
                        <ul className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-slate-300 space-y-3 mb-8">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Reclining Seat
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            WiFi + USB
                          </li>
                        </ul>
                        <button className="w-full py-4 bg-purple-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 ">
                          SELECT
                        </button>
                      </div>

                      {/* Premium */}
                      <div className="relative bg-amber-500/5 dark:bg-amber-500/10 rounded-lg p-8 border border-amber-200 dark:border-amber-800/50 hover:border-amber-500 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6 text-amber-600 dark:text-amber-400">
                          <div className="text-2xl font-black italic tracking-tighter">PREMIUM LUXURY</div>
                        </div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white mb-6 italic tracking-tighter">
                          {route.premiumPrice} <span className="text-xs font-bold uppercase tracking-widest text-gray-400">f</span>
                        </div>
                        <ul className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-slate-300 space-y-3 mb-8">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            180° Sleeper Seat
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Full Meal
                          </li>
                        </ul>
                        <button className="w-full py-4 bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 dark:hover:bg-slate-600 transition-all active:scale-95">
                          SELECT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-12">
            {/* Horaires du jour */}
            <div id="daily-schedule" className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 border border-gray-100 dark:border-slate-800 scroll-mt-32">
              <h2 className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em] mb-6 italic">Daily Departures</h2>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-8 flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-cyan-500" />
                Today
              </h3>

              <div className="space-y-4">
                {scheduleDays[0]?.trips.slice(0, 4).map((trip, index) => (
                  <button
                    key={index}
                    onClick={() => handleTripClick(trip)}
                    className="group w-full flex justify-between items-center p-6 bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-lg hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 text-left"
                  >
                    <div>
                      <div className="font-black text-2xl text-gray-900 dark:text-white italic tracking-tighter">{trip.time}</div>
                      <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">{trip.destination}</div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mb-2 ${getPriceTypeColor(trip.priceType)}`}>
                        {trip.priceType}
                      </div>
                      <div className="font-black text-xl text-cyan-600 dark:text-cyan-400 italic tracking-tighter">{trip.price} F</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowFullSchedule(true)}
                className="w-full mt-8 px-6 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all active:scale-95 "
              >
                Full Schedule
              </button>
            </div>

            {/* Statistiques */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl p-10 text-white overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-cyan-500/20 transition-all duration-1000" />

              <h2 className="relative z-10 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-10 italic">Performance</h2>

              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-4xl font-black italic tracking-tighter text-white uppercase">{agency.fleetSize}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 mt-2">Operational buses</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bus className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-4xl font-black italic tracking-tighter text-white uppercase">{agency.yearsOperating}y</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 mt-2">Of expertise</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-4xl font-black italic tracking-tighter text-white uppercase">98%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 mt-2">Punctuality</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl p-10 border border-gray-100 dark:border-slate-800">
              <h2 className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em] mb-10 italic">Traveler Experience</h2>
              <div className="grid grid-cols-1 gap-4">
                {agency.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center mr-4 shadow-sm text-cyan-500">
                      {getFeatureIcon(feature)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-slate-300">{translateFeature(feature)}</span>
                  </div>
                ))}
              </div>

              {/* Options de service */}
              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">On-site Service</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agency.hasOnSiteService ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {agency.hasOnSiteService ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Online Booking</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agency.hasOnlineAppointments ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {agency.hasOnlineAppointments ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}