// app/agencies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Bus, Star, MapPin, Phone, Mail, Clock, Users,
  Shield, CheckCircle, Calendar, Wifi, Coffee,
  Wind, Car, PhoneCall, ArrowLeft, X, User,
  Map, ChevronRight, Check, Battery, Tv, Music,
  Thermometer, Luggage, AlertCircle, DollarSign,
  Globe, Home, Building, Crown, Zap, Award,
  ExternalLink, Smartphone, CreditCard
} from 'lucide-react';
import { getAgencyById, type Agency } from '@/lib/api';

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
}

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

// Composant Logo avec fallback
const AgencyLogo = ({ agencyName, size = "large" }: { agencyName: string; size?: "small" | "large" }) => {
  const [imageError, setImageError] = useState(false);
  const assets = getAgencyAssets(agencyName);
  const dimensions = size === "large" ? "w-24 h-24" : "w-12 h-12";
  
  if (!assets.logo || imageError) {
    return (
      <div className={`${dimensions} rounded-xl bg-white flex items-center justify-center shadow-lg border-4 border-white`}>
        <Bus className={size === "large" ? "h-12 w-12 text-cyan-600" : "h-6 w-6 text-cyan-600"} />
      </div>
    );
  }
  
  return (
    <img 
      src={assets.logo} 
      alt={`Logo ${agencyName}`}
      className={`${dimensions} rounded-xl object-cover shadow-lg border-4 border-white`}
      onError={() => setImageError(true)}
    />
  );
};

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

// Générer le planning pour 3 jours
const generateSchedule = (agency: Agency): ScheduleDay[] => {
  const today = new Date();
  const days: ScheduleDay[] = [];
  
  // Noms des jours en français
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Générer pour aujourd'hui, demain et après-demain
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const formattedDate = date.toISOString().split('T')[0];
    const dayName = i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : dayNames[date.getDay()];
    
    // Créer les voyages pour cette journée
    const trips: Trip[] = agency.routes.slice(0, 4).map((route, index) => {
      const times = ['6:00', '8:00', '14:00', '20:00'];
      const priceType = ['standard', 'vip', 'premium'][index % 3] as 'standard' | 'vip' | 'premium';
      
      return {
        id: `${agency.id}_${i}_${index}`,
        time: times[index],
        destination: route.name.split('→')[1]?.trim() || route.name,
        priceType,
        price: priceType === 'standard' ? route.standardPrice : 
               priceType === 'vip' ? route.vipPrice : route.premiumPrice,
        availableSeats: Math.floor(Math.random() * 20) + 5,
        bus: {
          model: ['Volvo B8R 2023', 'Mercedes Sprinter 2024', 'Toyota Coaster'][index % 3],
          plateNumber: `CM-${String.fromCharCode(65 + index)}${String.fromCharCode(65 + i)}-${100 + index}`,
          amenities: ['WiFi', 'USB Charging', 'AC', 'TV', 'Toilet']
        },
        driver: {
          name: ['Jean Abena', 'Samuel Tchoumi', 'Martine Ngono'][index % 3],
          photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agency.id}_${index}`,
          experience: `${5 + index} ans d'expérience`
        },
        stops: ['Yaoundé Centre', 'Point Intermédiaire', route.name.split('→')[1]?.trim() || 'Destination'],
        duration: route.duration
      };
    });
    
    days.push({
      date: formattedDate,
      dayName,
      trips
    });
  }
  
  return days;
};

export default function AgencyDetailPage() {
  const params = useParams();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);

  useEffect(() => {
    const fetchAgency = async () => {
      if (!params.id) return;
      
      try {
        const data = await getAgencyById(params.id as string);
        if (data) {
          setAgency(data);
          setScheduleDays(generateSchedule(data));
          
          // DEBUG: Afficher le chemin de l'image
          const assets = getAgencyAssets(data.userName);
          console.log('DEBUG Agence:', data.userName);
          console.log('DEBUG Logo path:', assets.logo);
          console.log('DEBUG Bus photo path:', assets.busPhoto);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [params.id]);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-cyan-500 animate-bounce mx-auto mb-4" />
          <div className="text-gray-600">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Agence non trouvée</h2>
            <Link href="/agencies" className="text-cyan-600 hover:text-cyan-700 font-medium">
              ← Retour aux agences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const agencyName = agency.displayName || agency.userName;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Modal détails voyage */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Détails du Voyage</h2>
              <button onClick={() => setSelectedTrip(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Infos de base */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{selectedTrip.destination}</h3>
                    <p className="text-gray-600">{selectedTrip.time} • Durée: {selectedTrip.duration}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceTypeColor(selectedTrip.priceType)}`}>
                    {selectedTrip.priceType.toUpperCase()}
                  </span>
                </div>
                
                <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Prix par personne</p>
                      <p className="text-3xl font-bold text-cyan-600">{selectedTrip.price} FCFA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Places disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{selectedTrip.availableSeats}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infos chauffeur */}
              <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <img src={selectedTrip.driver.photo} alt="Chauffeur" className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <h3 className="font-bold text-lg">{selectedTrip.driver.name}</h3>
                  <p className="text-gray-600">{selectedTrip.driver.experience}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>
              </div>

              {/* Infos bus avec PHOTO DE L'AGENCE */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Informations du Bus</h3>
                
                {/* PHOTO DU BUS - TOUJOURS LA MÊME POUR L'AGENCE */}
                <AgencyBusPhoto 
                  agencyName={agencyName}
                  className="w-full h-48 mb-4"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Modèle</p>
                    <p className="font-medium">{selectedTrip.bus.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Plaque</p>
                    <p className="font-medium">{selectedTrip.bus.plateNumber}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Équipements</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.bus.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Arrêts */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Itinéraire</h3>
                <div className="space-y-3">
                  {selectedTrip.stops.map((stop, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-green-100 text-green-600' :
                        index === selectedTrip.stops.length - 1 ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {index === 0 ? 'D' : index === selectedTrip.stops.length - 1 ? 'A' : index}
                      </div>
                      <div>
                        <p className="font-medium">{stop}</p>
                        {index === 0 && <p className="text-sm text-gray-600">Départ: {selectedTrip.time}</p>}
                        {index === selectedTrip.stops.length - 1 && (
                          <p className="text-sm text-gray-600">Arrivée estimée</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600">
                  Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal planning complet sur 3 jours */}
      {showFullSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Planning Complet - {agency.userName}</h2>
              <button onClick={() => setShowFullSchedule(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {scheduleDays.map((day, dayIndex) => (
                <div key={dayIndex} className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-cyan-600 mr-2" />
                    {day.dayName} - {day.date}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Heure</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Destination</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Type</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Prix</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Places</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.trips.map((trip, tripIndex) => (
                          <tr key={tripIndex} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium">{trip.time}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{trip.destination}</div>
                              <div className="text-sm text-gray-500">{trip.duration}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceTypeColor(trip.priceType)}`}>
                                {trip.priceType.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-cyan-600">{trip.price} FCFA</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-400 mr-2" />
                                <span className={`font-medium ${
                                  trip.availableSeats > 10 ? 'text-green-600' : 
                                  trip.availableSeats > 5 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {trip.availableSeats} places
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => {
                                  handleTripClick(trip);
                                  setShowFullSchedule(false);
                                }}
                                className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 font-medium text-sm flex items-center"
                              >
                                Détails
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
                <h4 className="font-bold text-cyan-800 mb-2">Légende des tarifs :</h4>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span>Standard : Confort de base</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                    <span>VIP : Service amélioré</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                    <span>Premium : Luxe et exclusivité</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/agencies" className="inline-flex items-center text-cyan-600 hover:text-cyan-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux agences
          </Link>
        </div>
      </div>

      {/* Bannière agence */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center">
              {/* LOGO DE L'AGENCE */}
              <AgencyLogo agencyName={agencyName} size="large" />
              
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">{agencyName}</h1>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-white text-xl">{agency.rating}</span>
                  <span className="ml-2 text-cyan-100">({agency.reviewCount} avis)</span>
                  <span className="ml-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {agency.type}
                  </span>
                </div>
                <div className="mt-2 text-cyan-100">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {agency.serviceHours}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col gap-2">
              <button className="px-6 py-3 bg-white text-cyan-600 font-medium rounded-lg hover:bg-gray-50 shadow-md">
                Réserver un voyage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-600 mb-6">{agency.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-cyan-50 rounded-lg">
                  <Phone className="h-5 w-5 text-cyan-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Téléphone</div>
                    <div className="font-medium">{agency.phoneNumber}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-cyan-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-cyan-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Adresse</div>
                    <div className="font-medium">{agency.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Routes avec 3 types de prix */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Routes et Tarifs</h2>
              <div className="space-y-6">
                {agency.routes.map((route, index) => (
                  <div key={index} className="border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-bold text-lg text-gray-900">{route.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {route.duration} • {route.frequency}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Standard */}
                        <div className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-blue-700">STANDARD</span>
                            <span className="text-sm text-gray-500">Économique</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mb-2">{route.standardPrice} FCFA</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Siège confortable
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Bagage cabine
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Eau minérale
                            </li>
                          </ul>
                          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            Réserver Standard
                          </button>
                        </div>

                        {/* VIP */}
                        <div className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-purple-700">VIP</span>
                            <span className="text-sm text-gray-500">Confort supérieur</span>
                          </div>
                          <div className="text-2xl font-bold text-purple-600 mb-2">{route.vipPrice} FCFA</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Siège inclinable
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              WiFi + USB
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Snack offert
                            </li>
                          </ul>
                          <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                            Réserver VIP
                          </button>
                        </div>

                        {/* Premium */}
                        <div className="border border-amber-200 rounded-lg p-4 hover:bg-amber-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-amber-700">PREMIUM</span>
                            <span className="text-sm text-gray-500">Luxe exclusif</span>
                          </div>
                          <div className="text-2xl font-bold text-amber-600 mb-2">{route.premiumPrice} FCFA</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Siège-lit 180°
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Repas complet
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              Service privé
                            </li>
                          </ul>
                          <button className="w-full mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">
                            Réserver Premium
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div>
            {/* Horaires du jour */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 text-cyan-600 mr-2" />
                Aujourd'hui
              </h2>
              <div className="space-y-3">
                {scheduleDays[0]?.trips.slice(0, 4).map((trip, index) => (
                  <button
                    key={index}
                    onClick={() => handleTripClick(trip)}
                    className="w-full flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <div>
                      <div className="font-medium">{trip.time}</div>
                      <div className="text-sm text-gray-600">{trip.destination}</div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs mb-1 ${getPriceTypeColor(trip.priceType)}`}>
                        {trip.priceType.toUpperCase()}
                      </div>
                      <div className="font-bold text-cyan-600">{trip.price} FCFA</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <Users className="inline h-3 w-3" /> {trip.availableSeats} places
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowFullSchedule(true)}
                className="w-full mt-6 px-4 py-3 border-2 border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 font-medium transition-colors"
              >
                Voir planning 3 jours
              </button>
            </div>

            {/* Statistiques */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white mb-8">
              <h2 className="text-xl font-bold mb-6">Statistiques</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{agency.fleetSize}</div>
                    <div className="text-cyan-100">Bus en flotte</div>
                  </div>
                  <Car className="h-8 w-8 opacity-80" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{agency.yearsOperating}</div>
                    <div className="text-cyan-100">Années d'expérience</div>
                  </div>
                  <Award className="h-8 w-8 opacity-80" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-cyan-100">Taux de ponctualité</div>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services & Équipements</h2>
              <div className="grid grid-cols-2 gap-3">
                {agency.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <div className="p-1 bg-white rounded mr-2">
                      {getFeatureIcon(feature)}
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Options de service */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service sur place</span>
                  {agency.hasOnSiteService ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Rendez-vous en ligne</span>
                  {agency.hasOnlineAppointments ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}