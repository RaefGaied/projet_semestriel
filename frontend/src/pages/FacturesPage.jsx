import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMesReservations } from "../store/reservationSlice"
import Loading from "../components/Loading"
import { Download, Eye, Printer } from "lucide-react"

const FacturesPage = () => {
  const dispatch = useDispatch()
  const { reservations, loading } = useSelector((state) => state.reservations)
  const { user } = useSelector((state) => state.auth)
  const [selectedFacture, setSelectedFacture] = useState(null)

  useEffect(() => {
    if (user) {
      dispatch(fetchMesReservations())
    }
  }, [dispatch, user])

  const handleDownload = (reservation) => {
    alert(`Téléchargement de la facture pour la réservation ${reservation._id}`)
    // Logic pour télécharger la facture PDF
  }

  const handlePrint = (reservation) => {
    window.print()
  }

  const calculateDays = (arrival, departure) => {
    const start = new Date(arrival)
    const end = new Date(departure)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  if (loading) return <Loading fullScreen />

  // Filtrer les réservations confirmées ou payées
  const factures = reservations.filter(
    (r) => r.statut === "CONFIRMEE" || r.statut === "PAYEE"
  )

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Mes Factures</h1>
          <p className="text-gray-600">Consultation et téléchargement de vos factures</p>
        </div>

        {factures.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">Vous n'avez pas encore de factures.</p>
            <a href="/chambres" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Réserver une chambre
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {factures.map((facture) => {
              const days = calculateDays(facture.dateArrivee, facture.dateDepart)
              const factureNumber = `FAC-${facture._id?.slice(-6).toUpperCase()}`
              const factureDate = new Date(facture.createdAt).toLocaleDateString("fr-FR")
              const taxAmount = Math.round(facture.montantTotal * 0.2 * 100) / 100

              return (
                <div
                  key={facture._id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  {/* Header de la facture */}
                  <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Numéro de facture</p>
                        <p className="text-2xl font-bold">{factureNumber}</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Date</p>
                        <p className="text-lg font-semibold">{factureDate}</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Chambre</p>
                        <p className="text-lg font-semibold">#{facture.chambreId?.numero || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Statut</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                            facture.statut === "PAYEE"
                              ? "bg-green-200 text-green-900"
                              : "bg-yellow-200 text-yellow-900"
                          }`}
                        >
                          {facture.statut === "PAYEE" ? "✓ Payée" : "En attente"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corps de la facture */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                      {/* Détails du séjour */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Détails du séjour</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600">Arrivée</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(facture.dateArrivee).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Départ</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(facture.dateDepart).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Nombre de nuits</p>
                            <p className="font-semibold text-gray-900">{days}</p>
                          </div>
                        </div>
                      </div>

                      {/* Détails client */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Client</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600">Nom</p>
                            <p className="font-semibold text-gray-900">{user?.nom}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">ID Client</p>
                            <p className="font-semibold text-gray-900">{user?._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Totaux */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-3">Résumé du paiement</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sous-total</span>
                            <span className="font-semibold text-gray-900">
                              {Math.round((facture.montantTotal / 1.2) * 100) / 100}€
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">TVA (20%)</span>
                            <span className="font-semibold text-gray-900">{taxAmount}€</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                            <span className="font-bold text-gray-900">Total TTC</span>
                            <span className="text-xl font-bold text-blue-600">{facture.montantTotal}€</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <p className="text-xs text-gray-500">
                        Merci pour votre réservation. Cette facture est établie conformément aux conditions générales. En cas de
                        question, contactez-nous à support@hotelapp.fr
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          setSelectedFacture(selectedFacture?._id === facture._id ? null : facture)
                        }
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                      >
                        <Eye size={16} />
                        <span>Aperçu</span>
                      </button>
                      <button
                        onClick={() => handleDownload(facture)}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                      >
                        <Download size={16} />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handlePrint(facture)}
                        className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                      >
                        <Printer size={16} />
                        <span>Imprimer</span>
                      </button>
                    </div>
                  </div>

                  {/* Aperçu détaillé */}
                  {selectedFacture?._id === facture._id && (
                    <div className="bg-gray-50 border-t border-gray-200 p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Détails complets</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-gray-600">Type de chambre</p>
                          <p className="font-semibold text-gray-900">{facture.chambreId?.type || "N/A"}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-gray-600">Capacité</p>
                          <p className="font-semibold text-gray-900">
                            {facture.chambreId?.capacite || 0} pers.
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-gray-600">Prix/nuit</p>
                          <p className="font-semibold text-gray-900">
                            {Math.round((facture.montantTotal / days) * 100) / 100}€
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-gray-600">Identifiant</p>
                          <p className="font-semibold text-gray-900 text-xs">{facture._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FacturesPage
