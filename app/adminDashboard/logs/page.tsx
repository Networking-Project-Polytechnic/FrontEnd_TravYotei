"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Filter,
  Download,
  Search,
  Calendar,
  Clock,
  User,
  RefreshCw,
} from "lucide-react"

// Types
type LogLevel = "info" | "warning" | "error" | "success" | "all"
type LogCategory = "system" | "security" | "payment" | "user" | "agency" | "all"

type LogEntry = {
  id: string
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  user?: string
  details?: string
  ipAddress?: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>("all")
  const [selectedCategory, setSelectedCategory] = useState<LogCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  // Mock data - logs système
  const mockLogs: LogEntry[] = [
    {
      id: "1",
      timestamp: "2025-02-09T14:32:15",
      level: "error",
      category: "system",
      message: "Échec de connexion à la base de données",
      details: "Connection timeout après 30s. Serveur: db-primary-01",
      ipAddress: "192.168.1.50",
    },
    {
      id: "2",
      timestamp: "2025-02-09T14:28:42",
      level: "success",
      category: "agency",
      message: "Nouvelle agence validée",
      user: "admin@travyotei.cm",
      details: "Agence 'Express Voyages' approuvée avec succès",
    },
    {
      id: "3",
      timestamp: "2025-02-09T14:15:33",
      level: "warning",
      category: "security",
      message: "Tentative de connexion suspecte détectée",
      details: "5 tentatives échouées depuis la même IP",
      ipAddress: "41.202.219.45",
    },
    {
      id: "4",
      timestamp: "2025-02-09T13:58:17",
      level: "info",
      category: "payment",
      message: "Transaction de paiement traitée",
      user: "system",
      details: "Montant: 25,000 XAF - Agence: TransCam Services",
    },
    {
      id: "5",
      timestamp: "2025-02-09T13:45:28",
      level: "success",
      category: "user",
      message: "Nouvel utilisateur enregistré",
      user: "auto-register",
      details: "Compte créé: user_1247@travyotei.cm",
    },
    {
      id: "6",
      timestamp: "2025-02-09T13:22:41",
      level: "error",
      category: "payment",
      message: "Échec de transaction Mobile Money",
      user: "payment-gateway",
      details: "Code erreur: INSUFFICIENT_FUNDS",
      ipAddress: "192.168.1.100",
    },
    {
      id: "7",
      timestamp: "2025-02-09T12:58:09",
      level: "warning",
      category: "system",
      message: "Utilisation mémoire élevée",
      details: "Mémoire utilisée: 87% - Serveur: app-server-02",
    },
    {
      id: "8",
      timestamp: "2025-02-09T12:34:52",
      level: "info",
      category: "agency",
      message: "Nouvelle demande d'agence soumise",
      user: "j.kamdem@express.cm",
      details: "Agence: Rapid Transit - En attente de validation",
    },
    {
      id: "9",
      timestamp: "2025-02-09T11:47:23",
      level: "success",
      category: "system",
      message: "Sauvegarde automatique effectuée",
      details: "Backup DB créé: backup_2025-02-09_11-47.sql",
    },
    {
      id: "10",
      timestamp: "2025-02-09T11:15:38",
      level: "error",
      category: "security",
      message: "Tentative d'accès non autorisé",
      details: "Endpoint: /admin/users/delete - Token invalide",
      ipAddress: "203.45.67.89",
    },
  ]

  // Initialiser les logs au montage
  useEffect(() => {
    setLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [])

  // Filtrer les logs
  useEffect(() => {
    let filtered = logs

    // Filtrer par niveau
    if (selectedLevel !== "all") {
      filtered = filtered.filter((log) => log.level === selectedLevel)
    }

    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((log) => log.category === selectedCategory)
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.user?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, selectedLevel, selectedCategory, searchQuery])

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Simulation d'ajout d'un nouveau log
      const newLog: LogEntry = {
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: ["info", "success", "warning", "error"][
          Math.floor(Math.random() * 4)
        ] as LogLevel,
        category: ["system", "security", "payment", "user", "agency"][
          Math.floor(Math.random() * 5)
        ] as LogCategory,
        message: "Événement système généré automatiquement",
        details: "Ceci est un log de démonstration en temps réel",
      }
      setLogs((prev) => [newLog, ...prev])
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getLevelBadge = (level: LogLevel) => {
    const styles = {
      info: "bg-blue-100 text-blue-700",
      success: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
          styles[level as keyof typeof styles]
        }`}
      >
        {level}
      </span>
    )
  }

  const getCategoryBadge = (category: LogCategory) => {
    const styles = {
      system: "bg-gray-100 text-gray-700",
      security: "bg-purple-100 text-purple-700",
      payment: "bg-emerald-100 text-emerald-700",
      user: "bg-blue-100 text-blue-700",
      agency: "bg-orange-100 text-orange-700",
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          styles[category as keyof typeof styles]
        }`}
      >
        {category}
      </span>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `logs_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs système</h1>
          <p className="text-gray-600 mt-2">
            Monitoring et journalisation des événements
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              autoRefresh
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            Auto-refresh
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            count: logs.length,
            color: "bg-gray-100 text-gray-700",
          },
          {
            label: "Erreurs",
            count: logs.filter((l) => l.level === "error").length,
            color: "bg-red-100 text-red-700",
          },
          {
            label: "Warnings",
            count: logs.filter((l) => l.level === "warning").length,
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            label: "Succès",
            count: logs.filter((l) => l.level === "success").length,
            color: "bg-green-100 text-green-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-lg p-4 text-center`}
          >
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les logs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>

          {/* Filtre par niveau */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as LogLevel)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="all">Tous les niveaux</option>
            <option value="info">Info</option>
            <option value="success">Succès</option>
            <option value="warning">Warning</option>
            <option value="error">Erreur</option>
          </select>

          {/* Filtre par catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as LogCategory)
            }
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="all">Toutes les catégories</option>
            <option value="system">Système</option>
            <option value="security">Sécurité</option>
            <option value="payment">Paiement</option>
            <option value="user">Utilisateur</option>
            <option value="agency">Agence</option>
          </select>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun log trouvé</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                  log.level === "error"
                    ? "border-red-500"
                    : log.level === "warning"
                    ? "border-yellow-500"
                    : log.level === "success"
                    ? "border-green-500"
                    : "border-blue-500"
                } ${selectedLog?.id === log.id ? "ring-2 ring-blue-400" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getLevelIcon(log.level)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getLevelBadge(log.level)}
                        {getCategoryBadge(log.category)}
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {log.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.timestamp)}
                        </span>
                        {log.user && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.user}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détails du log sélectionné */}
        <div className="lg:col-span-1">
          {selectedLog ? (
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Détails du log
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    ID
                  </p>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedLog.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Timestamp
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatTimestamp(selectedLog.timestamp)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Niveau
                  </p>
                  <div className="mt-1">{getLevelBadge(selectedLog.level)}</div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Catégorie
                  </p>
                  <div className="mt-1">
                    {getCategoryBadge(selectedLog.category)}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Message
                  </p>
                  <p className="text-sm text-gray-900">{selectedLog.message}</p>
                </div>

                {selectedLog.details && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Détails
                    </p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                      {selectedLog.details}
                    </p>
                  </div>
                )}

                {selectedLog.user && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Utilisateur
                    </p>
                    <p className="text-sm text-gray-900">{selectedLog.user}</p>
                  </div>
                )}

                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Adresse IP
                    </p>
                    <p className="text-sm text-gray-900 font-mono">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 sticky top-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Sélectionnez un log pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
