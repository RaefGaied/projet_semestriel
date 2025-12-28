import { useParams, useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { MapPin, Star, Phone, Mail, ChevronLeft, Wifi, Utensils, ParkingCircle, Sparkles } from "lucide-react"

const HotelDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Données d'exemple - en production, utiliser l'API
  const hotels = [
    {
      id: 1,
      name: "Grand Hôtel Luxe",
      location: "Paris, France",
      stars: 5,
      rooms: 150,
      description: "Hôtel 5 étoiles avec services premium et vue panoramique",
      longDescription:
        "Situé au cœur de Paris, le Grand Hôtel Luxe offre une expérience inoubliable. Nos 150 chambres luxueuses sont équipées des dernières technologies et offrent une vue spectaculaire sur la ville. Profitez de nos restaurants étoilés Michelin, de notre spa de classe mondiale et de nos salles de conférence dernier cri.",
      phone: "+33 1 23 45 67 89",
      email: "contact@grandhote.fr",
      image: "🏨",
      checkIn: "15:00",
      checkOut: "11:00",
      rooms: 150,
      amenities: [
        { icon: "🍽️", name: "Restaurant gastronomique", prix: 0 },
        { icon: "🏊", name: "Piscine intérieure", prix: 0 },
        { icon: "💆", name: "Spa & Wellness", prix: 50 },
        { icon: "🅿️", name: "Parking privé", prix: 15 },
        { icon: "📶", name: "WiFi gratuit", prix: 0 },
        { icon: "🏋️", name: "Salle de fitness", prix: 0 },
      ],
      chambres: [
        { numero: "101", type: "SIMPLE", capacite: 1, prix: 120, statut: "DISPONIBLE" },
        { numero: "102", type: "SIMPLE", capacite: 1, prix: 120, statut: "DISPONIBLE" },
        { numero: "103", type: "DOUBLE", capacite: 2, prix: 180, statut: "DISPONIBLE" },
        { numero: "104", type: "DOUBLE", capacite: 2, prix: 180, statut: "INDISPONIBLE" },
        { numero: "105", type: "SUITE", capacite: 4, prix: 350, statut: "DISPONIBLE" },
        { numero: "106", type: "SUITE", capacite: 4, prix: 350, statut: "DISPONIBLE" },
      ],
    },
    {
      id: 2,
      name: "Hôtel Confort Plus",
      location: "Lyon, France",
      stars: 4,
      rooms: 100,
      description: "Hôtel 4 étoiles offrant un excellent rapport qualité-prix",
      longDescription:
        "Bienvenue à l'Hôtel Confort Plus, votre destination idéale à Lyon. Avec 100 chambres confortables et modernes, nous offrons un excellent rapport qualité-prix. Nos services incluent un restaurant traditionnel, un fitness et un accès gratuit au WiFi.",
      phone: "+33 4 56 78 90 12",
      email: "contact@hotelconfort.fr",
      image: "🏩",
      checkIn: "14:00",
      checkOut: "12:00",
      rooms: 100,
      amenities: [
        { icon: "🍽️", name: "Restaurant français", prix: 0 },
        { icon: "🏋️", name: "Salle de fitness", prix: 0 },
        { icon: "📶", name: "WiFi gratuit", prix: 0 },
        { icon: "🅿️", name: "Parking", prix: 10 },
        { icon: "☕", name: "Bar lounge", prix: 0 },
      ],
      chambres: [
        { numero: "201", type: "SIMPLE", capacite: 1, prix: 80, statut: "DISPONIBLE" },
        { numero: "202", type: "SIMPLE", capacite: 1, prix: 80, statut: "DISPONIBLE" },
        { numero: "203", type: "DOUBLE", capacite: 2, prix: 120, statut: "DISPONIBLE" },
        { numero: "204", type: "DOUBLE", capacite: 2, prix: 120, statut: "DISPONIBLE" },
      ],
    },
    {
      id: 3,
      name: "Hôtel Central",
      location: "Marseille, France",
      stars: 4,
      rooms: 85,
      description: "Idéalement situé au cœur du centre-ville avec parking gratuit",
      longDescription:
        "Découvrez l'Hôtel Central à Marseille, idéalement situé en plein cœur du centre-ville. Avec 85 chambres modernes et un parking gratuit, nous sommes le choix parfait pour les voyageurs d'affaires et les touristes.",
      phone: "+33 4 91 23 45 67",
      email: "contact@hotelcentral.fr",
      image: "🏨",
      checkIn: "15:00",
      checkOut: "11:00",
      rooms: 85,
      amenities: [
        { icon: "🍽️", name: "Restaurant", prix: 0 },
        { icon: "📶", name: "WiFi gratuit", prix: 0 },
        { icon: "🅿️", name: "Parking gratuit", prix: 0 },
        { icon: "☕", name: "Café", prix: 0 },
      ],
      chambres: [
        { numero: "301", type: "SIMPLE", capacite: 1, prix: 85, statut: "DISPONIBLE" },
        { numero: "302", type: "DOUBLE", capacite: 2, prix: 130, statut: "DISPONIBLE" },
        { numero: "303", type: "DOUBLE", capacite: 2, prix: 130, statut: "DISPONIBLE" },
      ],
    },
    {
      id: 4,
      name: "Auberge du Voyage",
      location: "Bordeaux, France",
      stars: 3,
      rooms: 60,
      description: "Auberge chaleureuse idéale pour les voyageurs",
      longDescription:
        "Bienvenue à l'Auberge du Voyage, un établissement chaleureux et convivial à Bordeaux. Avec ses 60 chambres confortables et son atmosphère accueillante, elle est idéale pour tous les voyageurs.",
      phone: "+33 5 56 78 90 12",
      email: "contact@aubergeduvoyage.fr",
      image: "🏩",
      checkIn: "14:00",
      checkOut: "11:00",
      rooms: 60,
      amenities: [
        { icon: "🍽️", name: "Restaurant", prix: 0 },
        { icon: "📶", name: "WiFi gratuit", prix: 0 },
      ],
      chambres: [
        { numero: "401", type: "SIMPLE", capacite: 1, prix: 60, statut: "DISPONIBLE" },
        { numero: "402", type: "DOUBLE", capacite: 2, prix: 90, statut: "DISPONIBLE" },
      ],
    },
  ]

  const hotel = hotels.find((h) => h.id === parseInt(id))
  const [selectedChambre, setSelectedChambre] = useState(null)

  if (!hotel) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hôtel non trouvé</h1>
          <p className="text-gray-600 mb-6">L'hôtel que vous recherchez n'existe pas.</p>
          <Link to="/hotels" className="text-blue-600 hover:text-blue-700 font-semibold">
            Retour à la liste des hôtels
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (stars) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    )
  }

  const chambresDisponibles = hotel.chambres.filter((c) => c.statut === "DISPONIBLE")
  const prixMin = Math.min(...hotel.chambres.map((c) => c.prix))
  const prixMax = Math.max(...hotel.chambres.map((c) => c.prix))

  return (
    <div className="bg-white min-h-screen">
      {/* Header avec bouton retour */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/hotels")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition"
          >
            <ChevronLeft size={20} />
            Retour aux hôtels
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg h-64 flex items-center justify-center text-9xl mb-12">
          {hotel.image}
        </div>

        {/* Infos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Colonne gauche - Détails */}
          <div className="lg:col-span-2">
            {/* Titre et note */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">{hotel.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                {renderStars(hotel.stars)}
                <span className="text-lg text-gray-600">({hotel.stars} étoiles)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={20} className="text-blue-600" />
                <span className="text-lg">{hotel.location}</span>
              </div>
            </div>

            {/* Description complète */}
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{hotel.longDescription}</p>
            </div>

            {/* Infos pratiques */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Infos pratiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Check-in</p>
                  <p className="font-semibold text-gray-900">{hotel.checkIn}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-out</p>
                  <p className="font-semibold text-gray-900">{hotel.checkOut}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Chambres disponibles</p>
                  <p className="font-semibold text-green-600">{chambresDisponibles.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total de chambres</p>
                  <p className="font-semibold text-gray-900">{hotel.rooms}</p>
                </div>
              </div>
            </div>

            {/* Services & Équipements */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Services & Équipements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{amenity.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{amenity.name}</p>
                          {amenity.prix > 0 && (
                            <p className="text-sm text-gray-600">+{amenity.prix}€</p>
                          )}
                        </div>
                      </div>
                      {amenity.prix === 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                          Gratuit
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nous contacter</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-blue-600" />
                  <a href={`tel:${hotel.phone}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                    {hotel.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-blue-600" />
                  <a href={`mailto:${hotel.email}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                    {hotel.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Résumé de prix */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prix des chambres</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">{prixMin}€ - {prixMax}€</div>
                <p className="text-sm text-gray-600">par nuit</p>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Types de chambres</h4>
                <div className="space-y-2">
                  {[...new Set(hotel.chambres.map((c) => c.type))].map((type) => {
                    const prices = hotel.chambres
                      .filter((c) => c.type === type)
                      .map((c) => c.prix)
                    const minPrice = Math.min(...prices)
                    return (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-gray-700">{type}</span>
                        <span className="font-semibold text-gray-900">dès {minPrice}€</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Link
                to={`/chambres?hotel=${hotel.id}`}
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-3"
              >
                Voir les chambres
              </Link>

              <p className="text-xs text-gray-600 text-center">
                {chambresDisponibles.length} chambre(s) disponible(s)
              </p>
            </div>
          </div>
        </div>

        {/* Chambres Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Chambres disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotel.chambres.map((chambre) => (
              <div
                key={chambre.numero}
                className={`rounded-lg border-2 p-4 cursor-pointer transition ${
                  selectedChambre?.numero === chambre.numero
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
                onClick={() =>
                  chambre.statut === "DISPONIBLE" && setSelectedChambre(chambre)
                }
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Chambre {chambre.numero}</h4>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded mt-1">
                      {chambre.type}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded ${
                      chambre.statut === "DISPONIBLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {chambre.statut === "DISPONIBLE" ? "Libre" : "Occupée"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacité</span>
                    <span className="font-semibold text-gray-900">{chambre.capacite} pers.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix/nuit</span>
                    <span className="font-bold text-blue-600 text-lg">{chambre.prix}€</span>
                  </div>
                </div>

                {chambre.statut === "DISPONIBLE" && (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm">
                    Réserver
                  </button>
                )}

                {chambre.statut === "INDISPONIBLE" && (
                  <button disabled className="w-full bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg text-sm cursor-not-allowed">
                    Non disponible
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetailsPage
