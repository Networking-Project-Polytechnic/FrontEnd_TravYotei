"use client"

import { Users, Building2, CheckCircle, Clock } from "lucide-react"

export default function AdminDashboardPage() {
  // Mock data pour les statistiques
  const stats = [
    {
      title: "Total Agences",
      value: "21",
      icon: Building2,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "En attente",
      value: "2",
      icon: Clock,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Validées",
      value: "17",
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Utilisateurs",
      value: "216",
      icon: Users,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Résumé Admin
        </h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de la plateforme TravYotei
        </p>
      </div>

      {/* Statistiques Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Activités récentes
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                action: "Nouvelle demande d'inscription",
                agency: "Rapid Transit",
                time: "Il y a 2 heures",
                type: "pending",
              },
              {
                action: "Agence validée",
                agency: "Tresor Voyage",
                time: "Il y a 5 heures",
                type: "approved",
              },
              {
                action: "Nouvelle demande d'inscription",
                agency: "Voyage Confort",
                time: "Il y a 1 jour",
                type: "pending",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "pending"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.agency}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
