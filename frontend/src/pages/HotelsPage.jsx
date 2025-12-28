import { MapPin, Star, Phone, Mail } from "lucide-react"
import { Link } from "react-router-dom"

const HotelsPage = () => {
  // Données d'exemple des hôtels
  const hotels = [
    {
      id: 1,
      name: "Grand Hôtel Luxe",
      location: "Paris, France",
      stars: 5,
      rooms: 150,
      description: "Hôtel 5 étoiles avec services premium et vue panoramique",
      phone: "+33 1 23 45 67 89",
      email: "contact@grandhote.fr",
      image: "🏨",
    },
    {
      id: 2,
      name: "Hôtel Confort Plus",
      location: "Lyon, France",
      stars: 4,
      rooms: 100,
      description: "Hôtel 4 étoiles offrant un excellent rapport qualité-prix",
      phone: "+33 4 56 78 90 12",
      email: "contact@hotelconfort.fr",
      image: "🏩",
    },
    {
      id: 3,
      name: "Hôtel Central",
      location: "Marseille, France",
      stars: 4,
      rooms: 85,
      description: "Idéalement situé au cœur du centre-ville avec parking gratuit",
      phone: "+33 4 91 23 45 67",
      email: "contact@hotelcentral.fr",
      image: "🏨",
    },
    {
      id: 4,
      name: "Auberge du Voyage",
      location: "Bordeaux, France",
      stars: 3,
      rooms: 60,
      description: "Auberge chaleureuse idéale pour les voyageurs",
      phone: "+33 5 56 78 90 12",
      email: "contact@aubergeduvoyage.fr",
      image: "🏩",
    },
  ]

  const renderStars = (stars) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">Nos Hôtels Partenaires</h1>
          <p className="text-lg text-gray-600">
            Découvrez nos établissements partenaires offrant les meilleures expériences de séjour
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Filtrer par note</h3>
          <div className="flex flex-wrap gap-3">
            {[5, 4, 3].map((stars) => (
              <button
                key={stars}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition flex items-center gap-2"
              >
                {renderStars(stars)}
                <span className="text-gray-700">{stars} étoiles</span>
              </button>
            ))}
            <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-medium">
              Tous
            </button>
          </div>
        </div>

        {/* Hôtels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Image */}
              <div className="bg-linear-to-br from-blue-100 to-blue-50 h-40 flex items-center justify-center text-6xl">
                {hotel.image}
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Titre et note */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(hotel.stars)}
                    <span className="text-sm text-gray-600">({hotel.stars} étoiles)</span>
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin size={18} className="text-blue-600" />
                  <span>{hotel.location}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                {/* Infos */}
                <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="font-semibold text-gray-900">{hotel.rooms} chambres</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Phone size={16} className="text-blue-600" />
                    <a href={`tel:${hotel.phone}`} className="hover:text-blue-600">
                      {hotel.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Mail size={16} className="text-blue-600" />
                    <a href={`mailto:${hotel.email}`} className="hover:text-blue-600">
                      {hotel.email}
                    </a>
                  </div>
                </div>

                {/* Bouton */}
                <div className="flex gap-2">
                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="flex-1 inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Détails
                  </Link>
                  <Link
                    to="/chambres"
                    className="flex-1 inline-block text-center bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
                  >
                    Chambres
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HotelsPage
