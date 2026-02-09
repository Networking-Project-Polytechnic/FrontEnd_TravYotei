"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Eye, Mail, Phone, MapPin } from "lucide-react"

// Types
type AgencyStatus = "pending" | "approved" | "rejected"

type AgencyRequest = {
  id: string
  agencyName: string
  managerName: string
  license: string
  submissionDate: string
  status: AgencyStatus
  email: string
  phone: string
  address: string
}

// Mock Data
const mockAgencyRequests: AgencyRequest[] = [
  {
    id: "1",
    agencyName: "Express Voyages",
    managerName: "Jean Kamdem",
    license: "LIC-2024-001",
    submissionDate: "2025-02-01",
    status: "pending",
    email: "j.kamdem@express-voyages.cm",
    phone: "+237 6 99 88 77 66",
    address: "Av. Kennedy, Yaoundé, Cameroun",
  },
  {
    id: "2",
    agencyName: "TransCam Services",
    managerName: "Marie Ngo",
    license: "LIC-2024-002",
    submissionDate: "2025-02-03",
    status: "approved",
    email: "m.ngo@transcam.cm",
    phone: "+237 6 77 88 99 00",
    address: "Rue de la Réunification, Douala, Cameroun",
  },
  {
    id: "3",
    agencyName: "Voyage Plus",
    managerName: "Paul Mbarga",
    license: "LIC-2024-003",
    submissionDate: "2025-02-05",
    status: "pending",
    email: "p.mbarga@voyageplus.cm",
    phone: "+237 6 55 44 33 22",
    address: "Carrefour Intendance, Yaoundé, Cameroun",
  },
  {
    id: "4",
    agencyName: "Central Bus",
    managerName: "Aminatou Bello",
    license: "LIC-2024-004",
    submissionDate: "2025-01-28",
    status: "rejected",
    email: "a.bello@centralbus.cm",
    phone: "+237 6 88 99 00 11",
    address: "Quartier Mokolo, Yaoundé, Cameroun",
  },
  {
    id: "5",
    agencyName: "Rapid Transit",
    managerName: "Eric Fouda",
    license: "LIC-2024-005",
    submissionDate: "2025-02-07",
    status: "pending",
    email: "e.fouda@rapidtransit.cm",
    phone: "+237 6 44 33 22 11",
    address: "Bonamoussadi, Douala, Cameroun",
  },
]

export default function ValidationPage() {
  const [requests, setRequests] = useState<AgencyRequest[]>(mockAgencyRequests)
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequest | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // Fonction pour approuver une agence
  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "approved" as AgencyStatus } : req
    ))
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: "approved" as AgencyStatus })
    }
  }

  // Fonction pour rejeter une agence
  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "rejected" as AgencyStatus } : req
    ))
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: "rejected" as AgencyStatus })
    }
    setShowRejectModal(false)
    setRejectReason("")
  }

  // Fonction pour obtenir le style du badge de statut
  const getStatusBadge = (status: AgencyStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            En attente
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Validé
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            Rejeté
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validation des Agences</h1>
        <p className="text-gray-600 mt-2">
          Gérez les demandes d'inscription des agences de transport
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau des demandes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nom Agence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Licence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedRequest?.id === request.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.agencyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{request.managerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-mono">
                        {request.license}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(request.submissionDate).toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panneau de détails */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <div className="bg-white rounded-lg shadow p-6 space-y-6 sticky top-8">
              {/* En-tête */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedRequest.agencyName}
                </h2>
                <div className="mt-2">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              {/* Informations */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Téléphone</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Adresse</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.address}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Licence</p>
                  <p className="text-sm text-gray-900 mt-1 font-mono">
                    {selectedRequest.license}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Responsable</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedRequest.managerName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Date de soumission
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedRequest.submissionDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approuver
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <XCircle className="w-5 h-5" />
                    Rejeter
                  </button>
                </div>
              )}

              {selectedRequest.status === "approved" && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-green-700 font-medium text-center">
                    ✓ Cette agence a été validée
                  </p>
                </div>
              )}

              {selectedRequest.status === "rejected" && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-red-700 font-medium text-center">
                    ✗ Cette demande a été rejetée
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez une demande pour voir les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de rejet */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rejeter la demande
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Vous êtes sur le point de rejeter la demande de{" "}
              <strong>{selectedRequest.agencyName}</strong>. Veuillez indiquer un motif.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motif du rejet..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
