'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Bus,
  User,
  X,
  Smartphone,
  Wifi,
  Wind,
  Info,
  ArrowLeft,
  Briefcase,
  Fuel,
  History,
  ChevronLeft
} from 'lucide-react';
import {
  getAgencyById,
  getAgencyOverview,
  getScheduleDetails,
  Agency,
  Schedule,
  ScheduleDetails,
  Location,
  Route,
  RoutePrice,
  Bus as BusType
} from '@/lib/api';
import { AgencyLogo } from '@/components/AgencyLogo';
import { useAuth } from '@/context/AuthContext';
import { AuthPromptModal } from '@/components/AuthPromptModal';

const formatTime = (timeString: string) => {
  if (!timeString) return '--:--';
  if (timeString.includes('T')) {
    return timeString.split('T')[1].substring(0, 5);
  }
  return timeString.substring(0, 5);
};


export default function AgencyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [selectedDate, setSelectedDate] = useState<string>(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [dateHistory, setDateHistory] = useState<string[]>([searchParams.get('date') || new Date().toISOString().split('T')[0]]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }

    const date = searchParams.get('date');
    if (date) setSelectedDate(date);

    const openScheduleId = searchParams.get('openSchedule');
    if (openScheduleId && !loading && user) {
      handleScheduleClick(openScheduleId);
    } else if (openScheduleId && !user) {
      setIsAuthModalOpen(true);
    }
  }, [searchParams, loading, user]);

  // Backend Data State
  const [overview, setOverview] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentBusImageIndex, setCurrentBusImageIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    if (!dateHistory.includes(newDate)) {
      setDateHistory(prev => [newDate, ...prev].slice(0, 5));
    } else {
      // Move to front if already exists
      setDateHistory(prev => [newDate, ...prev.filter(d => d !== newDate)].slice(0, 5));
    }
  };

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    handleDateChange(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    handleDateChange(date.toISOString().split('T')[0]);
  };

  useEffect(() => {
    async function initAgency() {
      const agencyId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!agencyId) return;

      try {
        setLoading(true);
        const data = await getAgencyById(agencyId);
        setAgency(data);

        // Fetch overview for schedules and other data
        setLoadingOverview(true);
        const overviewData = await getAgencyOverview(agencyId);
        setOverview(overviewData);
      } catch (error) {
        console.error('Error fetching agency details:', error);
      } finally {
        setLoading(false);
        setLoadingOverview(false);
      }
    }

    initAgency();
  }, [params.id]);

  const handleScheduleClick = async (scheduleId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setLoadingDetails(true);
      const data = await getScheduleDetails(scheduleId);
      setSelectedSchedule(data);
      setCurrentBusImageIndex(0);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching schedule details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter schedules from overview based on selectedDate
  const filteredSchedules = overview?.schedules?.filter((s: Schedule) => s.date === selectedDate) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center group">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6 animate-pulse transition-transform">
            <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-none animate-spin"></div>
          </div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Agency Profile...</div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center bg-white dark:bg-slate-900 p-10 rounded-none border border-gray-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-none flex items-center justify-center mx-auto mb-6">
            <Info className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 uppercase">Agency Not Found</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 font-medium">Sorry, we couldn't find the details for this agency.</p>
          <Link href="/agencies" className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Agencies
          </Link>
        </div>
      </div>
    );
  }

  const agencyName = agency.displayName || `${agency.firstName} ${agency.lastName}`;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Navigation */}
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/agencies" className="group inline-flex items-center text-gray-500 dark:text-slate-400 hover:text-cyan-600 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">
            <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to exploration
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-slate-900 dark:bg-slate-950 border-b border-slate-800 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="relative bg-white dark:bg-slate-900 p-1.5 rounded-none border border-slate-700 overflow-hidden">
                <AgencyLogo
                  agencyName={agencyName}
                  profileImageUrl={agency.profileImageUrl}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-none object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-none text-white text-[10px] font-bold uppercase tracking-widest">
                  {agency.type || 'Transport Agency'}
                </span>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-none text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Shield className="h-3 w-3" /> Verified Partner
                </span>
              </div>
              <h1 className="text-4xl sm:text-7xl font-bold text-white tracking-tight leading-tight mb-4">
                {agencyName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-300">{agency.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-300">License: {agency.licenseNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-none border border-gray-200 dark:border-slate-800 overflow-hidden min-h-[500px]">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-100 dark:border-slate-800 px-6 pt-6 sm:px-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-3 px-8 py-5 text-sm font-bold transition-all relative ${activeTab === tab.id
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 animate-in fade-in slide-in-from-bottom-1 duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
                      <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-slate-400 space-y-4 font-['Poppins',sans-serif]">
                        <p className="text-lg leading-relaxed">
                          {agency.bio || 'Providing quality transport services for all your travel needs.'}
                        </p>
                        <p>
                          Founded on the principles of reliability and community service, {agencyName} has grown to become a cornerstone of regional travel. We prioritize your comfort and time above all else.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-gray-100 dark:border-slate-800">
                        <Users className="h-6 w-6 text-cyan-600 mb-4" />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 uppercase text-[10px] tracking-widest">Community Focused</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Trusted by thousands of regular commuters daily.</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-gray-100 dark:border-slate-800">
                        <Star className="h-6 w-6 text-cyan-600 mb-4" />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 uppercase text-[10px] tracking-widest">Top Rated</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Consistently rated as one of the safest agencies.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-slate-900 text-white rounded-none">
                      <h3 className="text-lg font-bold mb-6">At a Glance</h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Years Operating</p>
                            <p className="font-bold">{agency.yearsOperating || '10+'} Years</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center">
                            <Bus className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Fleet Size</p>
                            <p className="font-bold">{agency.fleetSize || '25+'} Coaches</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Main Hub</p>
                            <p className="font-bold">{agency.address?.split(',')[0] || 'Regional Hub'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Date Selector Sidebar */}
                  <div className="w-full lg:w-72 shrink-0">
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-1">Pick a Date</h3>

                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={handlePrevDay}
                          className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Previous Day"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="flex-1 p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-none text-gray-900 dark:text-white font-bold tracking-tight focus:outline-none focus:border-cyan-500 transition-colors text-center"
                        />
                        <button
                          onClick={handleNextDay}
                          className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Next Day"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 px-1">
                        <button onClick={handlePrevDay} className="hover:text-cyan-500 transition-colors">Previous Day</button>
                        <button onClick={handleNextDay} className="hover:text-cyan-500 transition-colors">Next Day</button>
                      </div>
                    </div>



                    <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-none border border-amber-100 dark:border-amber-900/30">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                        <Info className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Note</span>
                      </div>
                      <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed font-medium">
                        Schedules are subject to change based on road conditions and vehicle availability.
                      </p>
                    </div>
                  </div>

                  {/* Trip List */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Available Departures
                        <span className="block text-sm font-medium text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>All times local (GMT+1)</span>
                      </div>
                    </div>

                    {loadingOverview ? (
                      <div className="p-20 text-center border border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent inline-block mb-4"></div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Fetching real departures...</p>
                      </div>
                    ) : filteredSchedules.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredSchedules.map((schedule: Schedule) => {
                          const route = overview.routes?.find((r: Route) => r.routeid === schedule.routeid);
                          const startLoc = overview.locations?.find((l: Location) => l.locationid === route?.startlocationid);
                          const endLoc = overview.locations?.find((l: Location) => l.locationid === route?.endlocationid);
                          const price = overview.routePrices?.find((p: RoutePrice) => p.priceId === schedule.priceid);
                          const bus = overview.buses?.find((b: BusType) => b.busId === schedule.busid);

                          return (
                            <button
                              key={schedule.scheduleid}
                              onClick={() => handleScheduleClick(schedule.scheduleid)}
                              className="group w-full grid grid-cols-1 md:grid-cols-5 items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-cyan-500/50 transition-all text-left"
                            >
                              <div className="flex flex-col">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">
                                  {formatTime(schedule.departuretime)}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                  Departure
                                </span>
                              </div>

                              <div className="md:col-span-2">
                                <div className="flex items-center space-x-4">
                                  <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                      {startLoc?.locationname || 'Origin'}
                                    </span>
                                  </div>
                                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-cyan-500 transition-colors" />
                                  <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                      {endLoc?.locationname || 'Destination'}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-[9px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                                    Est. {formatTime(schedule.arrivaltime)} Arrival
                                  </span>
                                  <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                                    <Users className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                      {bus?.totalSeats || '--'} Seats
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-center md:items-end">
                                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-500 tabular-nums">
                                  {price?.priceAmount || '—'} <span className="text-xs">{price?.currency || 'XAF'}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                  Starting Price
                                </span>
                              </div>

                              <div className="flex justify-end pr-2">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                  Details
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-20 text-center border border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                        <MapPin className="w-12 h-12 text-gray-200 dark:text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight uppercase">No schedules found</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                          There are no departures scheduled for this date.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center uppercase tracking-tight">Travel Excellence</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { title: 'Standard', desc: 'Reliable and comfortable travel for everyone.', price: '5,000+', features: ['Air Conditioning', 'Standard Seating', '2 Luggage Pieces'], color: 'slate' },
                      { title: 'VIP Lounge', desc: 'Premium experience with extra legroom and luxury.', price: '10,000+', features: ['WiFi Onboard', 'Reclining Seats', 'Refreshments', 'Priority Boarding'], color: 'amber' },
                      { title: 'Express', desc: 'Fastest routes with minimal intermediate stops.', price: '7,000+', features: ['Direct Routing', 'Dedicated Fleet', 'Flexible Bookings'], color: 'cyan' }
                    ].map((svc) => (
                      <div key={svc.title} className="p-8 rounded-none border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full hover:border-cyan-500/50 transition-colors">
                        <div className={`w-12 h-12 rounded-none mb-6 flex items-center justify-center ${svc.color === 'amber' ? 'bg-amber-100 text-amber-600' : svc.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-600'}`}>
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">{svc.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 flex-1 italic">{svc.desc}</p>
                        <div className="space-y-4 mb-8">
                          {svc.features.map(f => (
                            <div key={f} className="flex items-center gap-3 text-xs font-semibold text-gray-700 dark:text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {f}
                            </div>
                          ))}
                        </div>
                        <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Starts from</p>
                          <p className="text-lg font-bold dark:text-white">{svc.price} FCFA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight uppercase">Reach Out to Us</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-gray-200 dark:border-slate-800 flex items-center gap-6">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-none flex items-center justify-center border border-gray-100 dark:border-slate-700 text-cyan-500">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Direct Line</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{agency.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-gray-200 dark:border-slate-800 flex items-center gap-6">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-none flex items-center justify-center border border-gray-100 dark:border-slate-700 text-cyan-500">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Official Email</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight break-all">{agency.email}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-gray-200 dark:border-slate-800 flex items-center gap-6">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-none flex items-center justify-center border border-gray-100 dark:border-slate-700 text-cyan-500">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Headquarters</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{agency.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-800/50 rounded-none p-10 text-white flex flex-col justify-center relative overflow-hidden border border-slate-700">
                  <Shield className="h-10 w-10 text-cyan-500 mb-6" />
                  <h3 className="text-xl font-bold mb-4 tracking-tight uppercase tracking-widest">Security Assured</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">
                    Your journeys with {agencyName} are protected by our Secure Booking system. Every trip is monitored for safety and compliance with international standards.
                  </p>
                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-cyan-500 mb-2">Legal Identity</p>
                    <p className="text-lg font-bold tracking-tight uppercase text-slate-200">{agency.userName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center p-8 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          © {new Date().getFullYear()} TravYotei. All rights reserved. Professional Travel Network.
        </p>
      </div>

      {/* Schedule Details Modal */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)} />
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-0 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-cyan-600 flex items-center justify-center">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase">Journey Overview</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference: {selectedSchedule?.scheduleid || 'Loading...'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-3 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-32 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent inline-block mb-6"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Journey Data...</p>
              </div>
            ) : selectedSchedule ? (
              <div className="max-h-[80vh] overflow-y-auto">
                <div className="p-8 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Route & Timeline */}
                    <div className="lg:col-span-4 space-y-10">
                      <div>
                        <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-8">Navigation Path</h4>
                        <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-slate-200 dark:before:via-slate-800 before:to-emerald-500">

                          {/* Departure */}
                          <div className="relative">
                            <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-500 z-10" />
                            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-1">{selectedSchedule.departuretime}</p>
                            <h5 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                              {selectedSchedule.startLocation?.locationname}
                            </h5>
                            <p className="text-[10px] font-medium text-gray-400 mt-2 uppercase">Departure Point</p>
                          </div>

                          {/* Stop Points */}
                          {selectedSchedule.stopPoints && selectedSchedule.stopPoints.length > 0 && selectedSchedule.stopPoints.map((point, idx) => (
                            <div key={idx} className="relative opacity-60">
                              <div className="absolute -left-[27px] top-1.5 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 border border-white dark:border-slate-900 z-10" />
                              <h5 className="text-lg font-bold text-gray-600 dark:text-slate-400 tracking-tight leading-none">
                                {point}
                              </h5>
                              <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">Transit Station</p>
                            </div>
                          ))}

                          {/* Arrival */}
                          <div className="relative">
                            <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 z-10" />
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{selectedSchedule.arrivaltime}</p>
                            <h5 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                              {selectedSchedule.endLocation?.locationname}
                            </h5>
                            <p className="text-[10px] font-medium text-gray-400 mt-2 uppercase">Final Destination</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
                        <div className="p-6 bg-slate-900 text-white rounded-none relative overflow-hidden group">
                          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Briefcase className="w-24 h-24" />
                          </div>
                          <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-4">Total Fare</h4>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter">{selectedSchedule.price?.priceAmount}</span>
                            <span className="text-xl font-bold opacity-60 uppercase">{selectedSchedule.price?.currency || 'XAF'}</span>
                          </div>
                          <p className="text-[10px] font-medium text-slate-400 mt-4 uppercase tracking-widest">All inclusive • Protected booking</p>
                        </div>
                      </div>
                    </div>

                    {/* Middle Column: Vehicle Technical Details */}
                    <div className="lg:col-span-5 space-y-10">
                      <div>
                        <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-6">Vehicle Performance</h4>

                        {/* Bus Hero Image Carousel */}
                        <div className="aspect-video bg-gray-100 dark:bg-slate-800 mb-6 overflow-hidden border border-gray-200 dark:border-slate-700 relative group">
                          {selectedSchedule.busImages && selectedSchedule.busImages.length > 0 ? (
                            <>
                              <img
                                src={selectedSchedule.busImages[currentBusImageIndex].imageUrl}
                                alt={`Vehicle view ${currentBusImageIndex + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700"
                              />

                              {selectedSchedule.busImages.length > 1 && (
                                <>
                                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setCurrentBusImageIndex(prev => (prev === 0 ? selectedSchedule.busImages.length - 1 : prev - 1))}
                                      className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 text-gray-900 dark:text-white transition-all shadow-lg"
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => setCurrentBusImageIndex(prev => (prev === selectedSchedule.busImages.length - 1 ? 0 : prev + 1))}
                                      className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 text-gray-900 dark:text-white transition-all shadow-lg"
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <div className="absolute bottom-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                    {currentBusImageIndex + 1} / {selectedSchedule.busImages.length}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Bus className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest pointer-events-none">
                              {selectedSchedule.busTypeName}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                              <Users className="w-4 h-4 text-cyan-500" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capacity</span>
                            </div>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{selectedSchedule.bus?.totalSeats} <span className="text-xs opacity-50">Seats</span></p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                              <Briefcase className="w-4 h-4 text-cyan-500" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Luggage</span>
                            </div>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{selectedSchedule.bus?.luggageCapacityKg} <span className="text-xs opacity-50">KG</span></p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                              <Fuel className="w-4 h-4 text-cyan-500" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tank Capacity</span>
                            </div>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{selectedSchedule.bus?.tankCapacityLiters} <span className="text-xs opacity-50">L</span></p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                              <History className="w-4 h-4 text-cyan-500" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mileage</span>
                            </div>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{selectedSchedule.bus?.mileageKm?.toLocaleString()} <span className="text-xs opacity-50">Km/L</span></p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-4">Onboard Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSchedule.bus?.amenities?.map(amenity => (
                            <div key={amenity.amenityId} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 rounded-none">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{amenity.amenityName}</span>
                            </div>
                          )) || (
                              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <Wifi className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standard Features</span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Driver & Secondary Info */}
                    <div className="lg:col-span-3 space-y-10">
                      <div>
                        <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-6">Professional Crew</h4>
                        <div className="relative">
                          <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden mb-4">
                            {selectedSchedule.driverImages?.find(img => img.isPrimary)?.imageUrl ? (
                              <img
                                src={selectedSchedule.driverImages.find(img => img.isPrimary)?.imageUrl}
                                alt={selectedSchedule.driver?.fullName}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-16 h-16 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">{selectedSchedule.driver?.fullName}</h5>
                            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Certified Master Driver</p>
                          </div>
                        </div>

                        <div className="mt-8 space-y-4">
                          <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
                            <Phone className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm font-bold tracking-tight">{selectedSchedule.driver?.phone}</span>
                          </div>
                          <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
                            <Shield className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm font-bold tracking-tight">License: {selectedSchedule.driver?.licenseNumber}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-500 italic leading-relaxed pt-2">
                            "{selectedSchedule.driver?.description || 'Dedicated to safe and reliable transport across all regional routes.'}"
                          </p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-4">Cargo</h4>
                        <div className="space-y-3">
                          {selectedSchedule.bus?.canTransport?.map(item => (
                            <div key={item.transportId} className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-widest mb-1">• {item.itemName}</span>
                              <span className="text-[9px] font-medium text-gray-400 pl-3">{item.description || 'Allowed as regular luggage'}</span>
                            </div>
                          )) || (
                              <p className="text-[10px] text-gray-400 italic">Standard luggage policies apply.</p>
                            )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Section: Bus Gallery & Closing */}
                <div className="p-8 lg:p-12 bg-slate-50 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Vehicle Identity Card</h4>
                      <div className="flex flex-wrap gap-8">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Registration</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedSchedule.bus?.registrationNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Make / Model</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedSchedule.busMakeName} {selectedSchedule.busModelName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Registry Expiry</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedSchedule.bus?.registrationExpiryDate}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="w-full md:w-auto px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0"
                      onClick={() => setIsDetailsOpen(false)}
                    >
                      Close Overview
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}