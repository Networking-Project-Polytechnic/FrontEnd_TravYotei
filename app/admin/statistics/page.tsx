"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  MapPin,
  Bus,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react"

// Types
type TimeRange = "7d" | "30d" | "90d" | "1y"

type StatCard = {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

type ChartDataPoint = {
  label: string
  value: number
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")

  // Mock data - KPIs principaux
  const mainStats: StatCard[] = [
    {
      title: "Revenus totaux",
      value: "1,567,000 FCFA",
      change: 8.5,
      changeLabel: "vs mois dernier",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Agences actives",
      value: "17",
      change: 11.3,
      changeLabel: "vs mois dernier",
      icon: Building2,
      color: "blue",
    },
    {
      title: "Utilisateurs inscrits",
      value: "216",
      change: 20.1,
      changeLabel: "vs mois dernier",
      icon: Users,
      color: "violet",
    },
    {
      title: "Trajets complétés",
      value: "632",
      change: -4.2,
      changeLabel: "vs mois dernier",
      icon: Activity,
      color: "orange",
    },
  ]

  // Mock data - Graphique des inscriptions
  const registrationData: ChartDataPoint[] = [
    { label: "Jan", value: 45 },
    { label: "Fév", value: 52 },
    { label: "Mar", value: 48 },
    { label: "Avr", value: 61 },
    { label: "Mai", value: 55 },
    { label: "Jun", value: 67 },
    { label: "Jul", value: 72 },
    { label: "Aoû", value: 68 },
    { label: "Sep", value: 75 },
    { label: "Oct", value: 81 },
    { label: "Nov", value: 70 },
    { label: "Déc", value: 87 },
  ]

  // Mock data - Statistiques par région
  const regionalStats = [
    { region: "Centre", agencies: 6, users: 182, trips: 250 },
    { region: "Littoral", agencies: 5, users: 165, trips: 182 },
    { region: "Sud-Ouest", agencies: 3, users: 98, trips: 137 },
    { region: "Ouest", agencies: 3, users: 112, trips: 92 },
    { region: "Adamaoua", agencies: 1, users: 19, trips: 21 },
    { region: "Nord", agencies: 1, users: 15, trips: 18 },
  ]

  // Mock data - Top agences
  const topAgencies = [
    { name: "Express Voyages", trips: 123, revenue: "550,000 FCFA", rating: 4.8 },
    { name: "Trav Services", trips: 112, revenue: "470,000 FCFA", rating: 4.6 },
    { name: "Voyage Plus", trips: 96, revenue: "320,000 FCFA", rating: 4.7 },
    { name: "Central Bus", trips: 93, revenue: "230,000 FCFA", rating: 4.5 },
    { name: "Rapid VV", trips: 85, revenue: "210,000 FCFA", rating: 4.4 },
  ]

  const maxRegistration = Math.max(...registrationData.map((d) => d.value))

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        icon: "text-emerald-500",
      },
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        icon: "text-blue-500",
      },
      violet: {
        bg: "bg-violet-50",
        text: "text-violet-600",
        icon: "text-violet-500",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        icon: "text-orange-500",
      },
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="space-y-6">
      {/* Header avec sélecteur de période */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-2">
            Analyse des performances de la plateforme
          </p>
        </div>

        {/* Sélecteur de période */}
        <div className="flex gap-2 bg-white rounded-lg shadow p-1">
          {[
            { value: "7d", label: "7 jours" },
            { value: "30d", label: "30 jours" },
            { value: "90d", label: "90 jours" },
            { value: "1y", label: "1 an" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as TimeRange)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range.value
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => {
          const Icon = stat.icon
          const colors = getColorClasses(stat.color)
          const isPositive = stat.change > 0

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${colors.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.changeLabel}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des inscriptions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Inscriptions mensuelles
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Évolution des nouvelles inscriptions
              </p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          {/* Bar Chart */}
          <div className="h-72 flex items-end justify-between gap-3 px-2">
            {registrationData.map((data, index) => {
              const barHeight = (data.value / maxRegistration) * 100
              return (
                <div key={data.label} className="flex-1 flex flex-col items-center h-full">
                  <div className="w-full h-full flex flex-col justify-end pb-8">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative group shadow-sm"
                      style={{
                        height: `${barHeight}%`,
                        minHeight: '8px'
                      }}
                    >
                      {/* Tooltip au survol */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {data.value} inscriptions
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {data.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Agences */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Top Agences</h2>
          </div>

          <div className="space-y-4">
            {topAgencies.map((agency, index) => (
              <div
                key={agency.name}
                className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {agency.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">
                      {agency.trips} trajets
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-yellow-600 font-medium">
                      ⭐ {agency.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques régionales */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">
              Répartition par région
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Agences
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Utilisateurs
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trajets
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Part de marché
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {regionalStats.map((region, index) => {
                const totalAgencies = regionalStats.reduce(
                  (sum, r) => sum + r.agencies,
                  0
                )
                const marketShare = (
                  (region.agencies / totalAgencies) *
                  100
                ).toFixed(1)

                return (
                  <tr key={region.region} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0
                              ? "bg-blue-600"
                              : index === 1
                              ? "bg-violet-600"
                              : index === 2
                              ? "bg-emerald-600"
                              : index === 3
                              ? "bg-orange-600"
                              : "bg-gray-600"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {region.region}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {region.agencies}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-700">
                        {region.users.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-700">
                        {region.trips.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${marketShare}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12">
                          {marketShare}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}