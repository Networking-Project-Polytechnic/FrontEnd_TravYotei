// app/agencies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bus, Star, MapPin, Phone, Users, Search } from 'lucide-react';
import { getAgencies, type Agency } from '@/lib/api';
import { AgencyLogo } from '@/components/AgencyLogo';

// Logic moved to @/components/AgencyLogo

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
            <div className="text-gray-600">Loading agencies...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Transport Agencies</h1>
            <p className="text-cyan-100 text-lg mb-8">
              {agencies.length} agencies available
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search an agency..."
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAgencies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-slate-400 font-bold">No agencies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgencies.map((agency) => (
              <Link
                key={agency.id}
                href={`/agencies/${agency.id}`}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-800 hover:-translate-y-2 group"
              >
                <div className="p-6">
                  {/* Nom, logo et rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {/* LOGO DE L'AGENCE */}
                      <AgencyLogo
                        agencyName={agency.displayName || agency.userName}
                        className="w-16 h-16 rounded-2xl mr-4 border-2 border-white dark:border-slate-800 shadow-lg"
                      />
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">
                          {agency.displayName || agency.userName}
                        </h3>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-black text-gray-900 dark:text-white">{agency.rating}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500 dark:text-slate-400 text-sm">({agency.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
                      {agency.yearsOperating} years
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed h-10">
                    {agency.description}
                  </p>

                  {/* Contact */}
                  <div className="space-y-3 mb-6 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center text-sm text-gray-600 dark:text-slate-300">
                      <Phone className="h-4 w-4 mr-3 text-cyan-500" />
                      <span className="font-medium">{agency.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 mr-3 text-cyan-500" />
                      <span className="truncate font-medium">{agency.address}</span>
                    </div>
                  </div>

                  {/* Routes */}
                  <div className="mb-6">
                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 italic">Top Destinations:</p>
                    <div className="flex flex-wrap gap-2">
                      {agency.routes.slice(0, 3).map((route, index) => (
                        <span key={index} className="px-4 py-1.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-100 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider group-hover:border-cyan-500 transition-colors">
                          {route.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-slate-800 mb-6">
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 italic">{agency.fleetSize}</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-black">Bus</div>
                    </div>
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 italic">
                        {agency.routes.length}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-black">Routes</div>
                    </div>
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 italic">
                        {agency.features.length}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-black">Services</div>
                    </div>
                  </div>

                  {/* Bouton */}
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                    Explore Agency
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