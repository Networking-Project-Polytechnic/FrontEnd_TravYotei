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
    agency.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${agency.firstName} ${agency.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-12 flex items-center justify-center">
        <div className="text-center group">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6">
            <Bus className="h-10 w-10 text-cyan-500" />
          </div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading agencies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-500 font-['Poppins',sans-serif]">
      {/* Hero Section */}
      <div className="relative bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Partner Agencies
          </h1>
          <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto font-medium opacity-90">
            Discover {agencies.length} trusted transport partners providing seamless travel across the region.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {filteredAgencies.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-slate-400 font-bold text-xl">No agencies found matching your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 text-cyan-500 font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAgencies.map((agency) => (
              <Link
                key={agency.id}
                href={`/agencies/${agency.id}`}
                className="group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
              >

                <div className="p-8 relative z-10">
                  {/* Avatar/Info Section */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative shrink-0">
                      <AgencyLogo
                        agencyName={agency.firstName + ' ' + agency.lastName}
                        profileImageUrl={agency.profileImageUrl}
                        className="relative w-16 h-16 rounded-lg border border-gray-200 dark:border-slate-700 object-cover bg-white"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold uppercase tracking-widest rounded-md border border-cyan-100 dark:border-cyan-800/50">
                          Partner
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate leading-tight">
                        {agency.firstName} {agency.lastName}
                      </h3>
                      <div className="mt-2 flex items-center text-xs text-gray-400 dark:text-slate-500 font-medium">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{agency.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-8">
                    <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed min-h-[4.5rem]">
                      {agency.bio}
                    </p>
                  </div>

                  {/* Contact Info Card */}
                  <div className="grid grid-cols-1 gap-2 mb-8">
                    <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50">
                      <Phone className="h-4 w-4 text-cyan-500 mr-3" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{agency.phoneNumber}</span>
                    </div>
                  </div>

                  {/* Footer Stats/Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">License No.</p>
                      <p className="text-xs font-black text-gray-900 dark:text-white italic">{agency.licenseNumber}</p>
                    </div>
                    <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs tracking-tight hover:bg-slate-800 dark:hover:bg-gray-100 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}