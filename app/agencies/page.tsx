// app/agencies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bus, Star, MapPin, Phone, Users, Search } from 'lucide-react';
import { getAgencies, type Agency } from '@/lib/api';

// MAPPING DES LOGOS PAR AGENCE - CHEMINS CORRIGÉS
const AGENCY_LOGO_MAP: Record<string, string> = {
  "Buca Voyages": "/images/agencies/logos/logobuca.jpeg",
  "Cerise Voyage": "/images/agencies/logos/logocerises.jpeg", 
  "Charter Voyages": "/images/agencies/logos/logocharter.jpeg",
  "Finex Voyages": "/images/agencies/logos/logofinex.jpeg",
  "Garanti Voyage": "/images/agencies/logos/logogaranti.jpeg",
  "General Voyage": "/images/agencies/logos/logogeneral.jpeg",
  "Leader Voyage": "/images/agencies/logos/logoleader.png",
  "Men Travel Voyage": "/images/agencies/logos/logomen.jpeg",
  "Parklane Voyages": "/images/agencies/logos/logoparklane.png",
  "Touristique Voyages": "/images/agencies/logos/logotouristique.jpeg",
  "Transvoyages": "/images/agencies/logos/logotrans.png",
  "United Voyages": "/images/agencies/logos/logounited.jpeg",
  
  // Aliases pour correspondre aux différents noms possibles
  "Buca": "/images/agencies/logos/logobuca.jpeg",
  "Cerise": "/images/agencies/logos/logocerises.jpeg",
  "Charter": "/images/agencies/logos/logocharter.jpeg",
  "Finex": "/images/agencies/logos/logofinex.jpeg",
  "Garanti": "/images/agencies/logos/logogaranti.jpeg",
  "General": "/images/agencies/logos/logogeneral.jpeg",
  "Leader": "/images/agencies/logos/logoleader.png",
  "Men Travel": "/images/agencies/logos/logomen.jpeg",
  "Parklane": "/images/agencies/logos/logoparklane.png",
  "Touristique": "/images/agencies/logos/logotouristique.jpeg",
  "Trans": "/images/agencies/logos/logotrans.png",
  "United": "/images/agencies/logos/logounited.jpeg"
};

// Fonction pour obtenir le logo d'une agence
const getAgencyLogo = (agencyName: string): string | null => {
  if (!agencyName) return null;
  
  const name = agencyName.toLowerCase().trim();
  
  // Cherche une correspondance exacte
  for (const [key, logoPath] of Object.entries(AGENCY_LOGO_MAP)) {
    if (name === key.toLowerCase()) {
      return logoPath;
    }
  }
  
  // Cherche une correspondance partielle
  for (const [key, logoPath] of Object.entries(AGENCY_LOGO_MAP)) {
    if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
      return logoPath;
    }
  }
  
  // Cherche par mot clé
  const keywords: Record<string, string> = {
    'buca': '/images/agencies/logos/logobuca.jpeg',
    'cerise': '/images/agencies/logos/logocerises.jpeg',
    'charter': '/images/agencies/logos/logocharter.jpeg',
    'finex': '/images/agencies/logos/logofinex.jpeg',
    'garanti': '/images/agencies/logos/logogaranti.jpeg',
    'general': '/images/agencies/logos/logogeneral.jpeg',
    'leader': '/images/agencies/logos/logoleader.png',
    'men': '/images/agencies/logos/logomen.jpeg',
    'parklane': '/images/agencies/logos/logoparklane.png',
    'touristique': '/images/agencies/logos/logotouristique.jpeg',
    'trans': '/images/agencies/logos/logotrans.png',
    'united': '/images/agencies/logos/logounited.jpeg'
  };
  
  for (const [keyword, logoPath] of Object.entries(keywords)) {
    if (name.includes(keyword)) {
      return logoPath;
    }
  }
  
  return null;
};

// Composant Logo avec fallback
const AgencyLogo = ({ agencyName, className = "" }: { agencyName: string; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  const logoPath = getAgencyLogo(agencyName);
  
  if (!logoPath || imageError) {
    return (
      <div className={`${className} bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center`}>
        <Bus className="h-6 w-6 text-white" />
      </div>
    );
  }
  
  return (
    <img 
      src={logoPath} 
      alt={`Logo ${agencyName}`}
      className={`${className} object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAgencies();
        setAgencies(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredAgencies = agencies.filter(agency =>
    agency.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Bus className="h-16 w-16 text-cyan-500 animate-bounce mx-auto mb-4" />
            <div className="text-gray-600">Chargement des agences...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Agences de Transport</h1>
            <p className="text-cyan-100 text-lg mb-8">
              {agencies.length} agences disponibles
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une agence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des agences */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAgencies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune agence trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency) => (
              <Link
                key={agency.id}
                href={`/agencies/${agency.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                <div className="p-6">
                  {/* Nom, logo et rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {/* LOGO DE L'AGENCE */}
                      <AgencyLogo 
                        agencyName={agency.displayName || agency.userName}
                        className="w-12 h-12 rounded-lg mr-4 border border-gray-200"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {agency.displayName || agency.userName}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{agency.rating}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-600">({agency.reviewCount} avis)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                      {agency.yearsOperating} ans
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {agency.description}
                  </p>

                  {/* Contact */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{agency.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{agency.address}</span>
                    </div>
                  </div>

                  {/* Routes */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Destinations:</p>
                    <div className="flex flex-wrap gap-2">
                      {agency.routes.slice(0, 3).map((route, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {route.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-600">{agency.fleetSize}</div>
                      <div className="text-xs text-gray-500">Bus</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {agency.routes.length}
                      </div>
                      <div className="text-xs text-gray-500">Routes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {agency.features.length}
                      </div>
                      <div className="text-xs text-gray-500">Services</div>
                    </div>
                  </div>

                  {/* Bouton */}
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200">
                    Voir détails
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}