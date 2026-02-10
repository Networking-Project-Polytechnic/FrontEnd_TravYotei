"use client"

import { useState } from "react"
import {
  Save,
  Bell,
  Shield,
  Mail,
  Globe,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Database,
  Key,
} from "lucide-react"

// Types
type SettingCategory = "general" | "notifications" | "security" | "payments" | "system"

type NotificationSetting = {
  id: string
  label: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>("general")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  // État général
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "TravYotei",
    supportEmail: "support@travyotei.cm",
    maxAgenciesPerUser: "3",
    defaultLanguage: "fr",
    timezone: "Africa/Douala",
    maintenanceMode: false,
  })

  // État notifications
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "new_agency",
      label: "Nouvelles demandes d'agence",
      description: "Recevoir une notification pour chaque nouvelle demande",
      enabled: true,
    },
    {
      id: "agency_approved",
      label: "Agence validée",
      description: "Notification quand une agence est approuvée",
      enabled: true,
    },
    {
      id: "high_traffic",
      label: "Trafic élevé",
      description: "Alertes en cas de pic de trafic inhabituel",
      enabled: false,
    },
    {
      id: "system_errors",
      label: "Erreurs système",
      description: "Notifications pour les erreurs critiques",
      enabled: true,
    },
    {
      id: "daily_report",
      label: "Rapport quotidien",
      description: "Récapitulatif quotidien des activités",
      enabled: false,
    },
  ])

  // État sécurité
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    ipWhitelist: "",
  })

interface PlanPrices {
  free: string;
  basic: string;
  standard: string;
  premium: string;
}

interface PaymentSettings {
  currency: string;
  paymentGateway: string;
  autoPayoutEnabled: boolean;
  minPayoutAmount: string;
  planPrices: PlanPrices;
}

// État paiements
const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
  currency: "XAF",
  paymentGateway: "mobile_money",
  autoPayoutEnabled: false,
  minPayoutAmount: "10000",
  planPrices: {
    free: "0",
    basic: "5000",
    standard: "15000",
    premium: "30000",
  },
});

  // Simulation de sauvegarde
  const handleSave = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)
  }

  const toggleNotification = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    )
  }

  const categories = [
    { id: "general", label: "Général", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "payments", label: "Paiements", icon: DollarSign },
    { id: "system", label: "Système", icon: Database },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">
            Configuration de la plateforme TravYotei
          </p>
        </div>

        {/* Bouton Sauvegarder */}
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            saveStatus === "saved"
              ? "bg-green-600 text-white"
              : saveStatus === "saving"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {saveStatus === "saving" ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Sauvegardé
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu latéral des catégories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4 space-y-2 sticky top-8">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as SettingCategory)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contenu des paramètres */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow">
            {/* Paramètres Généraux */}
            {activeCategory === "general" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Paramètres généraux
                  </h2>
                  <p className="text-sm text-gray-600">
                    Configuration de base de la plateforme
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de la plateforme
                    </label>
                    <input
                      type="text"
                      value={generalSettings.platformName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          platformName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email de support
                    </label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          supportEmail: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Agences max par utilisateur
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxAgenciesPerUser}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          maxAgenciesPerUser: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Langue par défaut
                      </label>
                      <select
                        value={generalSettings.defaultLanguage}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            defaultLanguage: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            timezone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      >
                        <option value="Africa/Douala">Africa/Douala (GMT+1)</option>
                        <option value="Africa/Yaoundé">Africa/Yaoundé (GMT+1)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeCategory === "notifications" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Gérer les alertes et notifications système
                  </p>
                </div>

                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {notif.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notif.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(notif.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                          notif.enabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notif.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sécurité */}
            {activeCategory === "security" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Sécurité
                  </h2>
                  <p className="text-sm text-gray-600">
                    Paramètres de sécurité et d'authentification
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Authentification à deux facteurs
                        </p>
                        <p className="text-sm text-gray-600">
                          Protection renforcée du compte admin
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: !securitySettings.twoFactorAuth,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.twoFactorAuth
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.twoFactorAuth
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timeout de session (minutes)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiration mot de passe (jours)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordExpiry: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tentatives de connexion max
                    </label>
                    <input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Liste blanche IP (optionnel)
                    </label>
                    <textarea
                      value={securitySettings.ipWhitelist}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          ipWhitelist: e.target.value,
                        })
                      }
                      placeholder="192.168.1.1, 10.0.0.1"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paiements */}
            {activeCategory === "payments" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Paiements & Tarification
                  </h2>
                  <p className="text-sm text-gray-600">
                    Configurez la devise et les prix de vos abonnements
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Sélecteur de Devise */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Devise de l'application
                      </label>
                      <select
                        value={paymentSettings.currency}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            currency: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      >
                        <option value="XAF">XAF (Franc CFA)</option>
                        <option value="USD">USD (Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>
                    
                    {/* Placeholder pour l'équilibre visuel ou une autre option */}
                    <div className="hidden md:block"></div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Nouvelle Section : Tarification des Plans */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Prix des abonnements
                    </h3>
                    <div className="space-y-3">
                      {[
                        { id: "free" as keyof PlanPrices, label: "Plan Free", color: "bg-gray-100" },
                        { id: "basic" as keyof PlanPrices, label: "Plan Basic", color: "bg-blue-50" },
                        { id: "standard" as keyof PlanPrices, label: "Plan Standard", color: "bg-indigo-50" },
                        { id: "premium" as keyof PlanPrices, label: "Plan Premium", color: "bg-purple-50" },
                      ].map((plan) => (
                        <div 
                          key={plan.id} 
                          className={`flex flex-col md:flex-row md:items-center justify-between p-4 ${plan.color} rounded-xl border border-gray-200 gap-4 text-gray-600`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                            <span className="font-bold text-gray-700">{plan.label}</span>
                          </div>
                          
                          <div className="relative flex-1 md:max-w-[200px]">
                            <input
                              type="number"
                              placeholder="0"
                              value={paymentSettings.planPrices?.[plan.id] || ""}
                              onChange={(e) =>
                                setPaymentSettings({
                                  ...paymentSettings,
                                  planPrices: {
                                    ...paymentSettings.planPrices,
                                    [plan.id]: e.target.value,
                                  },
                                })
                              }
                              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right font-mono"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                              {paymentSettings.currency}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Passerelle de paiement */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Passerelle de paiement
                    </label>
                    <select
                      value={paymentSettings.paymentGateway}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          paymentGateway: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    >
                      <option value="mobile_money">Mobile Money</option>
                      <option value="orange_money">Orange Money</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>

                  {/* Toggle Automatique */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Paiements automatiques
                        </p>
                        <p className="text-sm text-gray-600">
                          Déclencher les versements automatiquement
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPaymentSettings({
                          ...paymentSettings,
                          autoPayoutEnabled: !paymentSettings.autoPayoutEnabled,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        paymentSettings.autoPayoutEnabled
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          paymentSettings.autoPayoutEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Système */}
            {activeCategory === "system" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Système
                  </h2>
                  <p className="text-sm text-gray-600">
                    Informations et maintenance système
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Version</p>
                      <p className="text-lg font-bold text-gray-900">v1.0.2</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">
                        Dernière mise à jour
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        06/02/2026
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">
                        consomation CPU serveur
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "67%" }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          67%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Serveur</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-lg font-bold text-gray-900">
                          Opérationnel
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Actions système
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <span className="font-medium text-gray-900">
                          Nettoyer le cache
                        </span>
                        <Database className="w-5 h-5 text-gray-600" />
                      </button>

                      <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <span className="font-medium text-gray-900">
                          Exporter les logs
                        </span>
                        <Save className="w-5 h-5 text-gray-600" />
                      </button>

                      <button className="w-full flex items-center justify-between p-4 border border-red-300 bg-red-50 rounded-lg hover:border-red-500 hover:bg-red-100 transition-all">
                        <span className="font-medium text-red-900">
                          Redémarrer le serveur
                        </span>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
