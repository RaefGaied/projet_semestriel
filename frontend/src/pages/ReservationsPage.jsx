import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMesReservations, cancelReservation } from "../store/reservationSlice"
import Loading from "../components/Loading"
import { Trash2, Eye, Download, CreditCard } from "lucide-react"

const ReservationsPage = () => {
  const dispatch = useDispatch()
  const { reservations, loading } = useSelector((state) => state.reservations)
  const { user } = useSelector((state) => state.auth)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [paymentModal, setPaymentModal] = useState(false)

  useEffect(() => {
    if (user) {
      dispatch(fetchMesReservations())
    }
  }, [dispatch, user])

  const handleCancel = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      await dispatch(cancelReservation(id))
      setSelectedReservation(null)
    }
  }

  const handlePay = (reservation) => {
    setSelectedReservation(reservation)
    setPaymentModal(true)
  }

  const processPayment = async () => {
    alert(`Paiement de ${selectedReservation.montantTotal}€ traité avec succès!`)
    setPaymentModal(false)
    setSelectedReservation(null)
  }

  const calculateDays = (arrival, departure) => {
    const start = new Date(arrival)
    const end = new Date(departure)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  if (loading) return <Loading fullScreen />

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Mes Réservations</h1>
          <p className="text-gray-600">Gestion et suivi de vos réservations</p>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">Vous n'avez pas encore de réservations.</p>
            <a href="/chambres" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Réserver une chambre
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => {
              const days = calculateDays(reservation.dateArrivee, reservation.dateDepart)
              return (
                <div
                  key={reservation._id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Chambre */}
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Chambre</p>
                      <p className="text-2xl font-bold text-blue-600">#{reservation.chambreId?.numero || "N/A"}</p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Arrivée</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(reservation.dateArrivee).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Départ</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(reservation.dateDepart).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    {/* Durée et prix */}
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Durée</p>
                      <p className="font-semibold text-gray-900">{days} nuit{days > 1 ? "s" : ""}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Montant</p>
                      <p className="text-xl font-bold text-gray-900">{reservation.montantTotal || 0}€</p>
                    </div>

                    {/* Statut */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          reservation.statut === "CONFIRMEE"
                            ? "bg-green-100 text-green-700"
                            : reservation.statut === "ANNULEE"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reservation.statut}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedReservation(selectedReservation?._id === reservation._id ? null : reservation)}
                      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
                    >
                      <Eye size={16} />
                      <span>Détails</span>
                    </button>

                    {reservation.statut === "CONFIRMEE" && (
                      <>
                        <button
                          onClick={() => handlePay(reservation)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
                        >
                          <CreditCard size={16} />
                          <span>Payer</span>
                        </button>
                        <button
                          onClick={() => handleCancel(reservation._id)}
                          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          <span>Annuler</span>
                        </button>
                      </>
                    )}

                    <a
                      href="/factures"
                      className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
                    >
                      <Download size={16} />
                      <span>Facture</span>
                    </a>
                  </div>

                  {/* Détails expandus */}
                  {selectedReservation?._id === reservation._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-3">Détails de la réservation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">ID Réservation</p>
                          <p className="font-semibold text-gray-900">{reservation._id}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date de création</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nombre de nuits</p>
                          <p className="font-semibold text-gray-900">{days}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Montant total</p>
                          <p className="font-bold text-blue-600 text-lg">{reservation.montantTotal}€</p>
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

      {/* Payment Modal */}
      {paymentModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmer le paiement</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Chambre</span>
                <span className="font-semibold text-gray-900">#{selectedReservation.chambreId?.numero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-semibold text-gray-900">
                  {calculateDays(selectedReservation.dateArrivee, selectedReservation.dateDepart)} nuits
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">Montant à payer</span>
                <span className="font-bold text-blue-600">{selectedReservation.montantTotal}€</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">Méthode de paiement</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" defaultChecked className="mr-3" />
                  <span className="text-gray-900">Carte bancaire</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" className="mr-3" />
                  <span className="text-gray-900">PayPal</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" className="mr-3" />
                  <span className="text-gray-900">Virement bancaire</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={processPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Payer {selectedReservation.montantTotal}€
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationsPage
