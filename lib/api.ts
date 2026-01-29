// lib/api.ts
export type Agency = {
  id: string;
  userName: string;
  displayName: string;
  description: string;
  address: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  yearsOperating: number;
  fleetSize: number;
  routes: {
    name: string;
    standardPrice: number;
    vipPrice: number;
    premiumPrice: number;
    duration: string;
    frequency: string;
  }[];
  features: string[];
  serviceHours: string;
  website?: string;
  hasOnSiteService: boolean;
  hasOnlineAppointments: boolean;
  type: 'Transportation service' | 'Bus company' | 'Travel agency' | 'Tour agency';
  // NOUVEAU : Chemins vers les images
  logo?: string; // Chemin vers le logo de l'agence
  busPhotos?: string[]; // Chemins vers les photos de bus
};

// Données pour 19 agences (sans les agences françaises)
const mockAgencies: Agency[] = [
  {
    id: '1',
    userName: 'parklanetravels',
    displayName: 'Parklane Travels',
    description: "Service de transport fiable ouvert 24h/24. Une des agences les plus accessibles de Yaoundé.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237683574765',
    rating: 4.0,
    reviewCount: 47,
    yearsOperating: 5,
    fleetSize: 18,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4500, vipPrice: 6500, premiumPrice: 8500, duration: '3-4h', frequency: 'Toutes les 2h' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3500, vipPrice: 5500, premiumPrice: 7500, duration: '3h', frequency: '6 voyages/jour' },
    ],
    features: ['Service 24h/24', 'WiFi', 'Climatisation', 'Bagages inclus'],
    serviceHours: '24h/24',
    website: 'https://parklanetravels.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Transportation service',
    // CHEMIN VERS LES IMAGES (à remplacer par vos vrais chemins)
    logo: '/images/agencies/logos/parklane-travels.png', // Votre logo
    busPhotos: [
      '/images/agencies/buses/bus1.jpg',
      '/images/agencies/buses/bus2.jpg'
    ]
  },
  {
    id: '2',
    userName: 'cerisesexpressvip',
    displayName: 'CERISES EXPRESS VIP',
    description: "Service VIP de transport avec équipements modernes et confort supérieur. Ferme à 22h.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237655319301',
    rating: 4.0,
    reviewCount: 265,
    yearsOperating: 8,
    fleetSize: 25,
    routes: [
      { name: 'Yaoundé → Douala VIP', standardPrice: 7000, vipPrice: 9000, premiumPrice: 12000, duration: '3h', frequency: '5 voyages/jour' },
      { name: 'Yaoundé → Kribi', standardPrice: 5500, vipPrice: 7500, premiumPrice: 10000, duration: '2.5h', frequency: '4 voyages/jour' },
    ],
    features: ['Service VIP', 'WiFi haute vitesse', 'Chargement USB', 'Repas léger'],
    serviceHours: 'Ouvert · Ferme à 22h',
    website: 'https://cerisesexpress.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Transportation service',
    logo: '/images/agencies/logos/cerises-express-vip.png',
    busPhotos: ['/images/agencies/buses/bus3.jpg']
  },
  {
    id: '3',
    userName: 'unitedexpress',
    displayName: 'United Express',
    description: "Compagnie de bus majeure avec réseau national, offrant confort et sécurité.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237653539696',
    rating: 3.8,
    reviewCount: 3400,
    yearsOperating: 12,
    fleetSize: 42,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4200, vipPrice: 6200, premiumPrice: 8200, duration: '4h', frequency: '10 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3200, vipPrice: 5200, premiumPrice: 7200, duration: '3h', frequency: '8 voyages/jour' },
    ],
    features: ['Grande capacité', 'Prix économique', 'Départs fréquents', 'Service national'],
    serviceHours: '6h-22h',
    website: 'https://unitedexpress.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Bus company',
    logo: '/images/agencies/logos/united-express.png',
    busPhotos: ['/images/agencies/buses/bus4.jpg']
  },
  {
    id: '4',
    userName: 'finexsvoyages',
    displayName: 'Finexs Voyages',
    description: "Agence réputée de Mvan offrant services sur place et transport fiable.",
    address: 'Mvan, Yaoundé, Cameroun',
    phoneNumber: '237696943131',
    rating: 3.8,
    reviewCount: 6100,
    yearsOperating: 10,
    fleetSize: 38,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4800, vipPrice: 6800, premiumPrice: 8800, duration: '3.5h', frequency: '8 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3800, vipPrice: 5800, premiumPrice: 7800, duration: '3h', frequency: '7 voyages/jour' },
    ],
    features: ['Service sur place', 'Climatisation', 'Confort moyen', 'Bagages inclus'],
    serviceHours: '7h-20h',
    website: 'https://finexsvoyages.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Bus company',
    logo: '/images/agencies/logos/finexs-voyages.png',
    busPhotos: ['/images/agencies/buses/bus5.jpg']
  },
  {
    id: '5',
    userName: 'mentravel',
    displayName: 'Men Travel',
    description: "Agence de voyage moderne avec plus de 3 ans d'expérience, services 24h/24 et rendez-vous en ligne.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237655432100',
    rating: 3.4,
    reviewCount: 750,
    yearsOperating: 4,
    fleetSize: 22,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4600, vipPrice: 6600, premiumPrice: 8600, duration: '4h', frequency: '6 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3600, vipPrice: 5600, premiumPrice: 7600, duration: '3h', frequency: '5 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Réservation en ligne', 'Service sur place', 'Rendez-vous en ligne'],
    serviceHours: '24h/24',
    website: 'https://mentravel.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: true,
    type: 'Travel agency',
    logo: '/images/agencies/logos/men-travel.png',
    busPhotos: ['/images/agencies/buses/bus6.jpg']
  },
  {
    id: '6',
    userName: 'garantiexpress',
    displayName: 'Garanti Express',
    description: "Agence de tourisme avec plus de 7 ans d'expérience, spécialisée dans les voyages touristiques.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237677084108',
    rating: 3.3,
    reviewCount: 1100,
    yearsOperating: 8,
    fleetSize: 28,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 5000, vipPrice: 7000, premiumPrice: 9000, duration: '3.5h', frequency: '7 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 4000, vipPrice: 6000, premiumPrice: 8000, duration: '3h', frequency: '6 voyages/jour' },
    ],
    features: ['Service touristique', 'Guide local', 'Expérience', 'Horaires réguliers'],
    serviceHours: 'Ouvert · Ferme à 17h',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Tour agency',
    logo: '/images/agencies/logos/garanti-express.png',
    busPhotos: ['/images/agencies/buses/bus7.jpg']
  },
  {
    id: '7',
    userName: 'binamvoyages',
    displayName: 'Binam Voyages',
    description: "Agence familiale avec plus de 10 ans d'expérience, offrant service 24h/24.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237699655599',
    rating: 3.1,
    reviewCount: 406,
    yearsOperating: 11,
    fleetSize: 20,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4400, vipPrice: 6400, premiumPrice: 8400, duration: '4h', frequency: '5 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3400, vipPrice: 5400, premiumPrice: 7400, duration: '3h', frequency: '6 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Expérience', 'Fiabilité', 'Prix accessible'],
    serviceHours: '24h/24',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/binam-voyages.png',
    busPhotos: ['/images/agencies/buses/bus8.jpg']
  },
  {
    id: '8',
    userName: 'touristiquexpressmvan',
    displayName: 'Touristique Express Mvan',
    description: "Agence touristique de Mvan avec plus de 3 ans d'expérience, ouverte 24h/24.",
    address: 'Mvan, Yaoundé, Cameroun',
    phoneNumber: '237655000111',
    rating: 3.6,
    reviewCount: 606,
    yearsOperating: 4,
    fleetSize: 24,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4700, vipPrice: 6700, premiumPrice: 8700, duration: '3.5h', frequency: '8 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3700, vipPrice: 5700, premiumPrice: 7700, duration: '3h', frequency: '7 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Service touristique', 'Horaires flexibles', 'Accueil chaleureux'],
    serviceHours: '24h/24',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/touristique-express-mvan.png',
    busPhotos: ['/images/agencies/buses/bus9.jpg']
  },
  {
    id: '9',
    userName: 'generalexpressmvan',
    displayName: 'General Express Mvan',
    description: "Importante compagnie de bus basée à Mvan avec large réseau.",
    address: 'Mvan, Yaoundé, Cameroun',
    phoneNumber: '237698168050',
    rating: 3.8,
    reviewCount: 2800,
    yearsOperating: 15,
    fleetSize: 45,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4500, vipPrice: 6500, premiumPrice: 8500, duration: '3.5h', frequency: '12 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3500, vipPrice: 5500, premiumPrice: 7500, duration: '3h', frequency: '10 voyages/jour' },
    ],
    features: ['Grande capacité', 'Départs fréquents', 'Réseau étendu', 'Fiabilité'],
    serviceHours: '6h-21h',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Bus company',
    logo: '/images/agencies/logos/general-express-mvan.png',
    busPhotos: ['/images/agencies/buses/bus10.jpg']
  },
  {
    id: '10',
    userName: 'touristiquexpresstravel',
    displayName: 'Touristique Express Travel',
    description: "Agence de voyage avec plus de 7 ans d'expérience, service 24h/24 et site web.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237698985555',
    rating: 3.7,
    reviewCount: 2400,
    yearsOperating: 8,
    fleetSize: 32,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4900, vipPrice: 6900, premiumPrice: 8900, duration: '3.5h', frequency: '9 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3900, vipPrice: 5900, premiumPrice: 7900, duration: '3h', frequency: '8 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Site web', 'Service touristique', 'Confort'],
    serviceHours: '24h/24',
    website: 'https://touristiquexpresstravel.cm',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/touristique-express-travel.png',
    busPhotos: ['/images/agencies/buses/bus11.jpg']
  },
  {
    id: '11',
    userName: 'chartexpressvoyages',
    displayName: 'Charter Express Voyages',
    description: "Agence de voyage spécialisée dans les charters, avec plus de 5 ans d'expérience.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237677393152',
    rating: 3.3,
    reviewCount: 64,
    yearsOperating: 6,
    fleetSize: 15,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 5100, vipPrice: 7100, premiumPrice: 9100, duration: '3.5h', frequency: '6 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 4100, vipPrice: 6100, premiumPrice: 8100, duration: '3h', frequency: '5 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Charters disponibles', 'Service personnalisé', 'Flexibilité'],
    serviceHours: '24h/24',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/charter-express.png',
    busPhotos: ['/images/agencies/buses/bus12.jpg']
  },
  {
    id: '12',
    userName: 'generalexpresstravel',
    displayName: 'General Express Travel',
    description: "Agence de voyage avec plus de 7 ans d'expérience, ferme à minuit.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237655530213',
    rating: 3.1,
    reviewCount: 175,
    yearsOperating: 8,
    fleetSize: 22,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4300, vipPrice: 6300, premiumPrice: 8300, duration: '4h', frequency: '8 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3300, vipPrice: 5300, premiumPrice: 7300, duration: '3h', frequency: '7 voyages/jour' },
    ],
    features: ['Horaires étendus', 'Service fiable', 'Prix accessible', 'Service local'],
    serviceHours: 'Ouvert · Ferme à minuit',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/general-express-travel.png',
    busPhotos: ['/images/agencies/buses/bus13.jpg']
  },
  {
    id: '13',
    userName: 'moghamoexpress',
    displayName: 'MOGHAMO EXPRESS',
    description: "Agence de tourisme spécialisée dans les régions du Nord, service 24h/24.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237680387258',
    rating: 3.4,
    reviewCount: 120,
    yearsOperating: 8,
    fleetSize: 18,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4700, vipPrice: 6700, premiumPrice: 8700, duration: '3.5h', frequency: '7 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3700, vipPrice: 5700, premiumPrice: 7700, duration: '3h', frequency: '6 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Régions du Nord', 'Service touristique', 'Accueil chaleureux'],
    serviceHours: '24h/24',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Tour agency',
    logo: '/images/agencies/logos/moghamo-express.png',
    busPhotos: ['/images/agencies/buses/bus14.jpg']
  },
  {
    id: '14',
    userName: 'touristiquevipvoyages',
    displayName: 'Touristique VIP Voyages',
    description: "Compagnie de bus offrant service VIP de qualité supérieure.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237699313130',
    rating: 4.1,
    reviewCount: 1500,
    yearsOperating: 10,
    fleetSize: 28,
    routes: [
      { name: 'Yaoundé → Douala VIP', standardPrice: 7200, vipPrice: 9200, premiumPrice: 12500, duration: '3h', frequency: '6 voyages/jour' },
      { name: 'Yaoundé → Bafoussam Express', standardPrice: 4700, vipPrice: 6700, premiumPrice: 8700, duration: '2.5h', frequency: '7 voyages/jour' },
    ],
    features: ['Service VIP', 'Confort premium', 'WiFi haut débit', 'Snacks premium'],
    serviceHours: '7h-20h',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Bus company',
    logo: '/images/agencies/logos/touristique-vip.png',
    busPhotos: ['/images/agencies/buses/bus15.jpg']
  },
  {
    id: '15',
    userName: 'bucavoyages',
    displayName: 'Bucavoyages',
    description: "Agence de voyage familiale avec plus de 25 ans d'expérience, service sur place.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237695463975',
    rating: 3.0,
    reviewCount: 6,
    yearsOperating: 26,
    fleetSize: 12,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4200, vipPrice: 6200, premiumPrice: 8200, duration: '4h', frequency: '5 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3200, vipPrice: 5200, premiumPrice: 7200, duration: '3h', frequency: '6 voyages/jour' },
    ],
    features: ['Service 24h/24', 'Service sur place', 'Expérience', 'Tradition'],
    serviceHours: '24h/24',
    website: 'https://bucavoyages.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/bucavoyages.png',
    busPhotos: ['/images/agencies/buses/bus16.jpg']
  },
  {
    id: '16',
    userName: 'bucavoyagesmvan',
    displayName: 'Buca voyage Mvan',
    description: "Branche Mvan de Bucavoyages avec plus de 7 ans d'expérience, ferme à 22h30.",
    address: 'Mvan, Yaoundé, Cameroun',
    phoneNumber: '237655432111',
    rating: 3.7,
    reviewCount: 2100,
    yearsOperating: 8,
    fleetSize: 30,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4400, vipPrice: 6400, premiumPrice: 8400, duration: '3.5h', frequency: '8 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3400, vipPrice: 5400, premiumPrice: 7400, duration: '3h', frequency: '7 voyages/jour' },
    ],
    features: ['Service sur place', 'Horaires étendus', 'Service Mvan', 'Accueil professionnel'],
    serviceHours: 'Ouvert · Ferme à 22h30',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/buca-mvan.png',
    busPhotos: ['/images/agencies/buses/bus17.jpg']
  },
  {
    id: '17',
    userName: 'leadervoyage',
    displayName: 'Leader Voyage',
    description: "Agence de voyage innovante avec plus de 5 ans d'expérience.",
    address: 'Yaoundé, Cameroun',
    phoneNumber: '237679106301',
    rating: 3.4,
    reviewCount: 242,
    yearsOperating: 6,
    fleetSize: 20,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4600, vipPrice: 6600, premiumPrice: 8600, duration: '4h', frequency: '6 voyages/jour' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3600, vipPrice: 5600, premiumPrice: 7600, duration: '3h', frequency: '5 voyages/jour' },
    ],
    features: ['Service Leader', 'Innovation', 'Confort moderne', 'Service client'],
    serviceHours: '8h-19h',
    hasOnSiteService: false,
    hasOnlineAppointments: false,
    type: 'Travel agency',
    logo: '/images/agencies/logos/leader-voyage.png',
    busPhotos: ['/images/agencies/buses/bus18.jpg']
  },
  {
    id: '18',
    userName: 'generalexpresstraveldouala',
    displayName: 'General Express Travel Douala',
    description: "Compagnie de bus basée à Douala avec réseau national.",
    address: 'Douala, Cameroun',
    phoneNumber: '237691630293',
    rating: 3.7,
    reviewCount: 2100,
    yearsOperating: 12,
    fleetSize: 35,
    routes: [
      { name: 'Douala → Yaoundé', standardPrice: 4500, vipPrice: 6500, premiumPrice: 8500, duration: '3.5h', frequency: '10 voyages/jour' },
      { name: 'Douala → Bafoussam', standardPrice: 5500, vipPrice: 7500, premiumPrice: 9500, duration: '3h', frequency: '8 voyages/jour' },
    ],
    features: ['Réseau national', 'Confort', 'Fiabilité', 'Service Douala'],
    serviceHours: '6h-22h',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Bus company',
    logo: '/images/agencies/logos/general-express-douala.png',
    busPhotos: ['/images/agencies/buses/bus19.jpg']
  },
  {
    id: '19',
    userName: 'transyaounde',
    displayName: 'TransYaounde',
    description: "Service fiable entre Yaoundé et Douala. Départs réguliers.",
    address: 'Quartier Bastos, Yaoundé',
    phoneNumber: '237670000001',
    rating: 4.6,
    reviewCount: 124,
    yearsOperating: 8,
    fleetSize: 18,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 4500, vipPrice: 6500, premiumPrice: 8500, duration: '3-4h', frequency: 'Toutes les 2h' },
      { name: 'Yaoundé → Bafoussam', standardPrice: 3500, vipPrice: 5500, premiumPrice: 7500, duration: '3h', frequency: '6 voyages/jour' },
    ],
    features: ['Wi-Fi', 'Climatisation', 'Bagages', 'Eau minérale'],
    serviceHours: '6h-22h',
    website: 'https://transyaounde.cm',
    hasOnSiteService: true,
    hasOnlineAppointments: false,
    type: 'Transportation service',
    logo: '/images/agencies/logos/transyaounde.png',
    busPhotos: ['/images/agencies/buses/bus20.jpg']
  }
];

// Fonction pour simuler un délai réseau
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export async function getAgencies(): Promise<Agency[]> {
  console.log('📡 [MOCK API] Récupération des 19 agences...');
  await simulateNetworkDelay();
  return mockAgencies;
}

export async function getAgencyById(id: string): Promise<Agency | null> {
  console.log(`📡 [MOCK API] Récupération agence ID: ${id}`);
  await simulateNetworkDelay();

  const agency = mockAgencies.find(agency => agency.id === id);

  if (agency) {
    return agency;
  }

  console.warn(`⚠️ Agence ID ${id} non trouvée`);
  return mockAgencies[0];
}

// Creation of packages
export const create_package = async (packageData: {}) => { }
// API Base URL
const API_BASE_URL = "http://localhost:8080"

// --- TypeScript Interfaces (Matching Swagger DTOs) ---

export interface BusAmenity {
  amenityId: string
  amenityName: string
  description?: string
  agencyId: string
}

export interface BusCanTransport {
  transportId: string
  itemName: string
  description?: string
  agencyId: string
}

export interface BusReview {
  reviewId: string
  busId: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface BusImage {
  imageId: string
  busId: string
  imageUrl: string
  isPrimary: boolean
  description?: string
  s3BucketName?: string
  s3Key?: string
  fileName?: string
  contentType?: string
  fileSize?: number
  uploadedAt?: string
}

export interface BusType {
  busTypeId: string
  busTypeName: string
  agencyId: string
}

export interface BusMake {
  busMakeId: string
  makeName: string
  agencyId: string
}

export interface BusModel {
  busModelId: string
  modelName: string
  agencyId: string
}

export interface FuelType {
  fuelTypeId: string
  fuelTypeName: string
  agencyId: string
}

export interface Manufacturer {
  manufacturerId: string
  manufacturerName: string
  agencyId: string
}

export interface TransmissionType {
  transmissionTypeId: string
  typeName: string
  agencyId: string
}

export interface Location {
  locationid: string
  locationname: string
  agencyid: string
}

export interface Route {
  routeid: string
  startlocationid: string
  endlocationid: string
  agencyid: string
  stopPoints?: string[]
}

export interface RoutePrice {
  priceId: string
  routeId: string
  busId: string
  priceAmount: number
  currency: string
  agencyid: string
}

export interface Driver {
  driverId: string
  fullName: string
  phone: string
  licenseNumber: string
  agencyid: string
}

export interface Schedule {
  scheduleid: string
  date: string
  arrivaltime: string
  departuretime: string
  routeid: string
  busid: string
  agencyid: string
  priceid: string
  driverid: string
}

export interface Bus {
  busId: string
  registrationNumber: string
  registrationExpiryDate?: string
  totalSeats: number
  mileageKm: number
  busMakeId: string
  busModelId: string
  manufacturerId: string
  fuelTypeId: string
  transmissionTypeId: string
  busTypeId: string
  luggageCapacityKg: number
  tankCapacityLiters: number
  agencyId: string
  amenities?: BusAmenity[]
  canTransport?: BusCanTransport[]
  reviews?: BusReview[]
  images?: BusImage[]
}

// --- Real API Endpoints ---

export interface DriverImage {
  imageId: string
  driverId: string
  imageUrl: string
  isPrimary: boolean
  description?: string
  s3BucketName?: string
  s3Key?: string
  fileName?: string
  contentType?: string
  fileSize?: number
  uploadedAt?: string
}

export interface Assignment {
  assignmentId: string
  scheduleId: string
  driverId: string
  agencyId: string
  assignmentDate: string
}

export interface ScheduleDetails extends Schedule {
  bus: Bus
  route: Route
  price: RoutePrice
  driver: Driver
  busImages: BusImage[]
  busReviews: BusReview[]
  driverImages: DriverImage[]
  stopPoints: string[]
  startLocation: Location
  endLocation: Location
  busTypeName: string
  busMakeName: string
  busModelName: string
}


/**
 * Fetch all data for an agency in one go (more efficient)
 */
export async function getAgencyOverview(agencyId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/agencies/${agencyId}/overview`)
  if (!response.ok) throw new Error("Failed to fetch agency overview")
  return response.json()
}

export async function getBuses(): Promise<Bus[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses`)
  if (!response.ok) throw new Error("Failed to fetch buses")
  return response.json()
}

export async function getBusById(id: string): Promise<Bus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/${id}`)
  if (!response.ok) throw new Error(`Failed to fetch bus with id ${id}`)
  return response.json()
}

export async function createBus(bus: Partial<Bus>, images?: File[]): Promise<Bus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bus),
  })
  if (!response.ok) throw new Error("Failed to create bus")
  return response.json()
}

export async function updateBus(id: string, bus: Partial<Bus>, images?: File[]): Promise<Bus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bus),
  })
  if (!response.ok) throw new Error("Failed to update bus")
  return response.json()
}

export async function deleteBus(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

// --- Locations ---
export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations`)
  if (!response.ok) return []
  return response.json()
}

export async function createLocation(location: Partial<Location>): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  })
  if (!response.ok) throw new Error("Failed to create location")
  return response.json()
}

export async function updateLocation(id: string, location: Partial<Location>): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  })
  if (!response.ok) throw new Error("Failed to update location")
  return response.json()
}

export async function deleteLocation(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Routes ---
export async function getRoutes(): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes`)
  if (!response.ok) return []
  return response.json()
}

export async function createRoute(route: Partial<Route>): Promise<Route> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route),
  })
  if (!response.ok) throw new Error("Failed to create route")
  return response.json()
}

export async function updateRoute(id: string, route: Partial<Route>): Promise<Route> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route),
  })
  if (!response.ok) throw new Error("Failed to update route")
  return response.json()
}

export async function deleteRoute(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Drivers ---
export async function getDrivers(): Promise<Driver[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers`)
  if (!response.ok) return []
  return response.json()
}

export async function createDriver(driver: Partial<Driver>, photo?: File): Promise<Driver> {
  // Simple JSON for now, assuming photo is handled separately if needed
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driver),
  })
  if (!response.ok) throw new Error("Failed to create driver")
  return response.json()
}

export async function updateDriver(id: string, driver: Partial<Driver>, photo?: File): Promise<Driver> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driver),
  })
  if (!response.ok) throw new Error("Failed to update driver")
  return response.json()
}

export async function deleteDriver(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Schedules (Trips) ---
export async function getSchedules(): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules`)
  if (!response.ok) return []
  return response.json()
}

export async function createSchedule(schedule: Partial<Schedule>): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  })
  if (!response.ok) throw new Error("Failed to create schedule")
  return response.json()
}

export async function updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  })
  if (!response.ok) throw new Error("Failed to update schedule")
  return response.json()
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Route Prices (Fares) ---
export async function getRoutePrices(): Promise<RoutePrice[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices`)
  if (!response.ok) return []
  return response.json()
}

export async function createRoutePrice(price: Partial<RoutePrice>): Promise<RoutePrice> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(price),
  })
  if (!response.ok) throw new Error("Failed to create fare")
  return response.json()
}

export async function updateRoutePrice(id: string, price: Partial<RoutePrice>): Promise<RoutePrice> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(price),
  })
  if (!response.ok) throw new Error("Failed to update fare")
  return response.json()
}

export async function deleteRoutePrice(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Lookup Helpers ---

export async function getBusMakes(): Promise<BusMake[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusMake(make: Partial<BusMake>): Promise<BusMake> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(make),
  })
  if (!response.ok) throw new Error("Failed to create bus make")
  return response.json()
}

export async function updateBusMake(id: string, make: Partial<BusMake>): Promise<BusMake> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(make),
  })
  if (!response.ok) throw new Error("Failed to update bus make")
  return response.json()
}

export async function deleteBusMake(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getBusModels(): Promise<BusModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusModel(model: Partial<BusModel>): Promise<BusModel> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  })
  if (!response.ok) throw new Error("Failed to create bus model")
  return response.json()
}

export async function updateBusModel(id: string, model: Partial<BusModel>): Promise<BusModel> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  })
  if (!response.ok) throw new Error("Failed to update bus model")
  return response.json()
}

export async function deleteBusModel(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers`)
  if (!response.ok) return []
  return response.json()
}

export async function createManufacturer(man: Partial<Manufacturer>): Promise<Manufacturer> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(man),
  })
  if (!response.ok) throw new Error("Failed to create manufacturer")
  return response.json()
}

export async function updateManufacturer(id: string, man: Partial<Manufacturer>): Promise<Manufacturer> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(man),
  })
  if (!response.ok) throw new Error("Failed to update manufacturer")
  return response.json()
}

export async function deleteManufacturer(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getFuelTypes(): Promise<FuelType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types`)
  if (!response.ok) return []
  return response.json()
}

export async function createFuelType(type: Partial<FuelType>): Promise<FuelType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to create fuel type")
  return response.json()
}

export async function updateFuelType(id: string, type: Partial<FuelType>): Promise<FuelType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to update fuel type")
  return response.json()
}

export async function deleteFuelType(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getTransmissionTypes(): Promise<TransmissionType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types`)
  if (!response.ok) return []
  return response.json()
}

export async function createTransmissionType(type: Partial<TransmissionType>): Promise<TransmissionType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to create transmission type")
  return response.json()
}

export async function updateTransmissionType(id: string, type: Partial<TransmissionType>): Promise<TransmissionType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to update transmission type")
  return response.json()
}

export async function deleteTransmissionType(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getBusTypes(): Promise<BusType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusType(type: Partial<BusType>): Promise<BusType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to create bus type")
  return response.json()
}

export async function updateBusType(id: string, type: Partial<BusType>): Promise<BusType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to update bus type")
  return response.json()
}

export async function deleteBusType(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getVehicleAmenities(): Promise<BusAmenity[]> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities`)
  if (!response.ok) return []
  return response.json()
}

export async function createVehicleAmenity(amenity: Partial<BusAmenity>): Promise<BusAmenity> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amenity),
  })
  if (!response.ok) throw new Error("Failed to create amenity")
  return response.json()
}

export async function updateVehicleAmenity(id: string, amenity: Partial<BusAmenity>): Promise<BusAmenity> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amenity),
  })
  if (!response.ok) throw new Error("Failed to update amenity")
  return response.json()
}

export async function deleteVehicleAmenity(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getBusTransportables(): Promise<BusCanTransport[]> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusTransportable(item: Partial<BusCanTransport>): Promise<BusCanTransport> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!response.ok) throw new Error("Failed to create transportable item")
  return response.json()
}

export async function updateBusTransportable(id: string, item: Partial<BusCanTransport>): Promise<BusCanTransport> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!response.ok) throw new Error("Failed to update transportable item")
  return response.json()
}

export async function deleteBusTransportable(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Agency Scoped Getters & Extra Endpoints ---

export async function getBusesByAgency(agencyId: string): Promise<Bus[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusByRegistrationNumber(registrationNumber: string): Promise<Bus | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/registration/${registrationNumber}`)
  if (!response.ok) return null
  return response.json()
}



export async function getDriversByAgency(agencyId: string): Promise<Driver[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getDriverByFullName(fullName: string): Promise<Driver | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/name/${fullName}`)
  if (!response.ok) return null
  return response.json()
}

export async function getDriverByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/license/${licenseNumber}`)
  if (!response.ok) return null
  return response.json()
}

export async function getRoutesByAgency(agencyId: string): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getLocationsByAgency(agencyId: string): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getLocationByName(locationName: string): Promise<Location | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/name/${locationName}`)
  if (!response.ok) return null
  return response.json()
}

export async function getSchedulesByAgency(agencyId: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSchedulesByDate(date: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/date/${date}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSchedulesByBus(busId: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/bus/${busId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSchedulesByRoute(routeId: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/route/${routeId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getScheduleDetails(scheduleId: string): Promise<ScheduleDetails> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${scheduleId}/details`)
  if (!response.ok) throw new Error("Failed to fetch schedule details")
  return response.json()
}

export async function getRoutePricesByAgency(agencyId: string): Promise<RoutePrice[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusMakesByAgency(agencyId: string): Promise<BusMake[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusModelsByAgency(agencyId: string): Promise<BusModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getManufacturersByAgency(agencyId: string): Promise<Manufacturer[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getFuelTypesByAgency(agencyId: string): Promise<FuelType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getTransmissionTypesByAgency(agencyId: string): Promise<TransmissionType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusTypesByAgency(agencyId: string): Promise<BusType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getVehicleAmenitiesByAgency(agencyId: string): Promise<BusAmenity[]> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getTransportablesByAgency(agencyId: string): Promise<BusCanTransport[]> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

// --- Driver Images ---

export async function getDriverImages(driverId: string): Promise<DriverImage[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images/driver/${driverId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getPrimaryDriverImage(driverId: string): Promise<DriverImage | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images/driver/${driverId}/primary`)
  if (!response.ok) return null
  return response.json()
}

// NOTE: Creating images usually involves FormData. This is a placeholder signature.
export async function deleteDriverImage(imageId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images/${imageId}`, { method: "DELETE" })
  return response.ok
}

// --- Bus Images ---

export async function getBusImages(busId: string): Promise<BusImage[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images/bus/${busId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getPrimaryBusImage(busId: string): Promise<BusImage | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images/bus/${busId}/primary`)
  if (!response.ok) return null
  return response.json()
}

export async function deleteBusImage(imageId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images/${imageId}`, { method: "DELETE" })
  return response.ok
}

// --- Assignments ---

export async function getAssignments(): Promise<Assignment[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments`)
  if (!response.ok) return []
  return response.json()
}

export async function getAssignmentsByAgency(agencyId: string): Promise<Assignment[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function createAssignment(assignment: Partial<Assignment>): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignment),
  })
  if (!response.ok) throw new Error("Failed to create assignment")
  return response.json()
}

export async function updateAssignment(id: string, assignment: Partial<Assignment>): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignment),
  })
  if (!response.ok) throw new Error("Failed to update assignment")
  return response.json()
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Bus Reviews ---

export async function getBusReviews(): Promise<BusReview[]> {
  const response = await fetch(`${API_BASE_URL}/api/bus-reviews`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusReview(review: Partial<BusReview>): Promise<BusReview> {
  const response = await fetch(`${API_BASE_URL}/api/bus-reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  })
  if (!response.ok) throw new Error("Failed to create review")
  return response.json()
}

export async function deleteBusReview(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/bus-reviews/${id}`, { method: "DELETE" })
  return response.ok
}

// Fonctions mockées utiles (si besoin ailleurs dans l'app)

export const login = async (...args: any[]) => ({ token: "mock-token" });
export const signup = async (...args: any[]) => ({ success: true });
export const signup_agency = async (...args: any[]) => ({ success: true });
export const login_admin = async (...args: any[]) => ({ token: "mock-admin-token" });
export const signup_admin = async (...args: any[]) => ({ success: true });
export const getTrackingByCode = async (...args: any[]) => ({
  status: "EN TRANSIT",
  bus_id: "mock-bus-id",
  start: [0, 0],
  end: [1, 1]
});
export const getTrackingHistory = async (...args: any[]) => [];
export const updateTracking = async (...args: any[]) => ({ success: true });
