import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Building2, Bed } from "lucide-react"
import { createHotel } from "../store/hotelSlice"

const AddHotelPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [hotelData, setHotelData] = useState({
    nom: "",
    adresse: "",
    ville: "",
    telephone: "",
    email: "",
    description: "",
    etoiles: 3,
  })

  const [chambres, setChambres] = useState([
    {
      numero: "",
      type: "SIMPLE",
      capacite: 1,
      prix: 0,
      vue: "",
      statut: "DISPONIBLE"
    }
  ])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleHotelChange = (e) => {
    const { name, value } = e.target
    setHotelData(prev => ({
      ...prev,
      [name]: name === "etoiles" ? Number(value) : value
    }))
  }

  const handleChambreChange = (index, field, value) => {
    const newChambres = [...chambres]
    newChambres[index][field] = field === "capacite" || field === "prix" ? Number(value) : value
    setChambres(newChambres)
  }

  const addChambre = () => {
    setChambres([...chambres, {
      numero: "",
      type: "SIMPLE",
      capacite: 1,
      prix: 0,
      vue: "",
      statut: "DISPONIBLE"
    }])
  }

  const removeChambre = (index) => {
    if (chambres.length > 1) {
      setChambres(chambres.filter((_, i) => i !== index))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validation hôtel
    if (!hotelData.nom.trim()) newErrors.nom = "Le nom est requis"
    if (!hotelData.adresse.trim()) newErrors.adresse = "L'adresse est requise"
    if (!hotelData.ville.trim()) newErrors.ville = "La ville est requise"
    if (!hotelData.telephone.trim()) newErrors.telephone = "Le téléphone est requis"
    if (!hotelData.email.trim()) newErrors.email = "L'email est requis"

    // Validation chambres
    chambres.forEach((chambre, index) => {
      if (!chambre.numero.trim()) {
        newErrors[`chambre_${index}_numero`] = "Le numéro est requis"
      }
      if (chambre.prix <= 0) {
        newErrors[`chambre_${index}_prix`] = "Le prix doit être supérieur à 0"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Créer l'hôtel avec ses chambres
      const result = await dispatch(createHotel({
        ...hotelData,
        chambres: chambres
      })).unwrap()
      
      navigate('/hotels')
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      setErrors({ submit: error.message || "Erreur lors de la création de l'hôtel" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/hotels')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour aux hôtels</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter un Hôtel</h1>
          <p className="text-gray-600 mt-2">Créez un nouvel hôtel avec ses chambres</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de l'hôtel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Informations de l'hôtel</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'hôtel *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={hotelData.nom}
                  onChange={handleHotelChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Hôtel Le Prestige"
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  name="ville"
                  value={hotelData.ville}
                  onChange={handleHotelChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.ville ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Paris"
                />
                {errors.ville && <p className="text-red-500 text-sm mt-1">{errors.ville}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={hotelData.adresse}
                  onChange={handleHotelChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.adresse ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Avenue des Champs-Élysées"
                />
                {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={hotelData.telephone}
                  onChange={handleHotelChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={hotelData.email}
                  onChange={handleHotelChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contact@hotel.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'étoiles
                </label>
                <select
                  name="etoiles"
                  value={hotelData.etoiles}
                  onChange={handleHotelChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} étoile{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={hotelData.description}
                  onChange={handleHotelChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de l'hôtel, services disponibles, etc."
                />
              </div>
            </div>
          </div>

          {/* Chambres */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bed className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Chambres de l'hôtel</h2>
              </div>
              <button
                type="button"
                onClick={addChambre}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Ajouter une chambre
              </button>
            </div>

            <div className="space-y-4">
              {chambres.map((chambre, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Chambre #{index + 1}</h3>
                    {chambres.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChambre(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro *
                      </label>
                      <input
                        type="text"
                        value={chambre.numero}
                        onChange={(e) => handleChambreChange(index, 'numero', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`chambre_${index}_numero`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="101"
                      />
                      {errors[`chambre_${index}_numero`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`chambre_${index}_numero`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={chambre.type}
                        onChange={(e) => handleChambreChange(index, 'type', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="SIMPLE">Simple</option>
                        <option value="DOUBLE">Double</option>
                        <option value="SUITE">Suite</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacité
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={chambre.capacite}
                        onChange={(e) => handleChambreChange(index, 'capacite', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix (€/nuit) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={chambre.prix}
                        onChange={(e) => handleChambreChange(index, 'prix', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`chambre_${index}_prix`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="50.00"
                      />
                      {errors[`chambre_${index}_prix`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`chambre_${index}_prix`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vue
                      </label>
                      <input
                        type="text"
                        value={chambre.vue}
                        onChange={(e) => handleChambreChange(index, 'vue', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mer, Ville, Jardin..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select
                        value={chambre.statut}
                        onChange={(e) => handleChambreChange(index, 'statut', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="OCCUPEE">Occupée</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/hotels')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer l\'hôtel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddHotelPage
