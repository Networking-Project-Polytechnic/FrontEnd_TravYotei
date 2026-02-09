// app/agencies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Bus,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  DollarSign,
  User,
  Shield,
  Star,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { getAgencyById, getDriversByAgency, getSchedulesByAgency, type Agency } from '@/lib/api';
import { AgencyLogo } from '@/components/AgencyLogo';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  photoUrl?: string;
}

interface Schedule {
  scheduleid: string;
  date: string;
  departuretime: string;
  arrivaltime: string;
  price: {
    priceAmount: number;
    currency: string;
  };
  busTypeName: string;
  startLocation: { locationname: string };
  endLocation: { locationname: string };
}

export default function AgencyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agencyId = params?.id as string;

  const [agency, setAgency] = useState<Agency | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les modales et navigation
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'schedules' | 'drivers' | 'about'>('schedules');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [agencyData, driversData, schedulesData] = await Promise.all([
          getAgencyById(agencyId),
          getDriversByAgency(agencyId),
          getSchedulesByAgency(agencyId)
        ]);
        
        setAgency(agencyData);
        setDrivers(driversData || []);
        setSchedules(schedulesData || []);

        // Vérifier si on doit ouvrir un planning spécifique
        const openScheduleId = searchParams?.get('openSchedule');
        if (openScheduleId && schedulesData) {
          const index = schedulesData.findIndex((s: Schedule) => s.scheduleid === openScheduleId);
          if (index !== -1) {
            setCurrentScheduleIndex(index);
            setActiveTab('schedules');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    if (agencyId) {
      fetchData();
    }
  }, [agencyId, searchParams]);

  // Navigation entre plannings
  const goToNextSchedule = () => {
    if (currentScheduleIndex < schedules.length - 1) {
      setCurrentScheduleIndex(currentScheduleIndex + 1);
    }
  };

  const goToPreviousSchedule = () => {
    if (currentScheduleIndex > 0) {
      setCurrentScheduleIndex(currentScheduleIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Bus className="h-10 w-10 text-cyan-500 animate-bounce" />
          </div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-slate-400">Agence non trouvée</p>
          <Link href="/agencies" className="text-cyan-500 hover:underline mt-4 inline-block">
            Retour aux agences
          </Link>
        </div>
      </div>
    );
  }

  const currentSchedule = schedules[currentScheduleIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header avec retour */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/agencies"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux agences
          </Link>
          
          <div className="flex items-start gap-6">
            <AgencyLogo
              agencyName={`${agency.firstName} ${agency.lastName}`}
              profileImageUrl={agency.profileImageUrl}
              className="w-24 h-24 rounded-xl border-2 border-gray-200 dark:border-slate-700"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {agency.firstName} {agency.lastName}
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mb-4">{agency.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Phone className="h-4 w-4 mr-2 text-cyan-500" />
                  {agency.phoneNumber}
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 mr-2 text-cyan-500" />
                  {agency.address}
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Shield className="h-4 w-4 mr-2 text-cyan-500" />
                  Licence: {agency.licenseNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'schedules'
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Plannings ({schedules.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'drivers'
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Chauffeurs ({drivers.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              À propos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Tab: Schedules avec navigation */}
          {activeTab === 'schedules' && (
            <motion.div
              key="schedules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {schedules.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">Aucun planning disponible</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
                  {/* Indicateur de position */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      Planning {currentScheduleIndex + 1} sur {schedules.length}
                    </div>
                    <div className="flex gap-2">
                      {schedules.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentScheduleIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentScheduleIndex
                              ? 'w-8 bg-cyan-500'
                              : 'w-2 bg-gray-300 dark:bg-slate-700 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Détails du planning actuel */}
                  {currentSchedule && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Départ</div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-green-500" />
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                  {currentSchedule.startLocation?.locationname || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-slate-400">
                                  {new Date(currentSchedule.departuretime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Arrivée</div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-red-500" />
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                  {currentSchedule.endLocation?.locationname || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-slate-400">
                                  {new Date(currentSchedule.arrivaltime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-cyan-500" />
                              <span className="text-sm text-gray-600 dark:text-slate-400">Date</span>
                            </div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {new Date(currentSchedule.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Bus className="h-5 w-5 text-cyan-500" />
                              <span className="text-sm text-gray-600 dark:text-slate-400">Type de bus</span>
                            </div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {currentSchedule.busTypeName || 'Standard'}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-cyan-500" />
                              <span className="text-sm text-cyan-700 dark:text-cyan-400">Prix</span>
                            </div>
                            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                              {currentSchedule.price?.priceAmount?.toLocaleString() || '5,000'} {currentSchedule.price?.currency || 'FCFA'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Boutons de navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-800">
                    <button
                      onClick={goToPreviousSchedule}
                      disabled={currentScheduleIndex === 0}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Précédent
                    </button>

                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      Parcourez tous les plannings disponibles
                    </div>

                    <button
                      onClick={goToNextSchedule}
                      disabled={currentScheduleIndex === schedules.length - 1}
                      className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab: Drivers avec bouton Voir Plus */}
          {activeTab === 'drivers' && (
            <motion.div
              key="drivers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {drivers.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">Aucun chauffeur enregistré</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                          {driver.firstName[0]}{driver.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {driver.firstName} {driver.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {driver.phoneNumber}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDriver(driver)}
                        className="w-full px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-lg font-semibold hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                      >
                        Voir plus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Tab: About */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                À propos de {agency.firstName} {agency.lastName}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  {agency.bio || "Cette agence fournit des services de transport de qualité dans toute la région."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Détails Chauffeur */}
      <AnimatePresence>
        {selectedDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDriver(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Détails du chauffeur
                </h3>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {selectedDriver.firstName[0]}{selectedDriver.lastName[0]}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedDriver.firstName} {selectedDriver.lastName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                      <Shield className="h-4 w-4 text-cyan-500" />
                      Permis: {selectedDriver.licenseNumber}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedDriver.phoneNumber}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white break-all">
                      {selectedDriver.email}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      Date de naissance
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedDriver.dateOfBirth).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedDriver.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800">
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
