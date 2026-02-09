// app/agencies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bus, MapPin, Phone, Search, Filter, ChevronRight, Star } from 'lucide-react';
import { getAgencies, type Agency } from '@/lib/api';
import { AgencyLogo } from '@/components/AgencyLogo';

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
    agency.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${agency.firstName} ${agency.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Bus className="h-10 w-10 text-cyan-500" />
          </div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des agences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Nos Agences Partenaires
            </h1>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto font-medium opacity-90">
              Découvrez {agencies.length} agences de transport de confiance offrant des services de qualité à travers le pays
            </p>

            {/* Barre de recherche améliorée */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, ville ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-lg"
                />
              </div>
              {searchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAgencies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md"
          >
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune agence trouvée</h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Essayez de modifier votre recherche ou parcourez toutes les agences
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition-colors"
            >
              Afficher toutes les agences
            </button>
          </motion.div>
        ) : (
          <>
            {/* Résultats trouvés */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-slate-400">
                <span className="font-bold text-gray-900 dark:text-white">{filteredAgencies.length}</span> {filteredAgencies.length === 1 ? 'agence trouvée' : 'agences trouvées'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgencies.map((agency, index) => (
                <motion.div
                  key={agency.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/agencies/${agency.id}`}
                    className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-xl block h-full"
                  >
                    <div className="p-6">
                      {/* Header avec logo et badge */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="relative shrink-0">
                          <AgencyLogo
                            agencyName={agency.firstName + ' ' + agency.lastName}
                            profileImageUrl={agency.profileImageUrl}
                            className="relative w-16 h-16 rounded-xl border-2 border-gray-200 dark:border-slate-700 object-cover bg-white shadow-md group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold uppercase tracking-widest rounded-md border border-cyan-100 dark:border-cyan-800/50">
                              Partenaire
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {agency.firstName} {agency.lastName}
                          </h3>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mb-6">
                        <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed min-h-[4.5rem]">
                          {agency.bio}
                        </p>
                      </div>

                      {/* Informations de contact */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <MapPin className="h-4 w-4 text-cyan-500 shrink-0" />
                          <span className="truncate">{agency.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <Phone className="h-4 w-4 text-cyan-500 shrink-0" />
                          <span>{agency.phoneNumber}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div className="text-xs">
                          <span className="text-gray-400 dark:text-slate-500 block mb-1">Licence</span>
                          <span className="font-black text-gray-900 dark:text-white">
                            {agency.licenseNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs tracking-tight group-hover:bg-cyan-500 dark:group-hover:bg-cyan-500 dark:group-hover:text-white transition-colors">
                          Voir détails
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Effet hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}