const Hotel = require('../models/Hotel');
const Facture = require('../models/Facture');
const Chambre = require('../models/Chambre');
const Reservation = require('../models/Reservation');
const Service = require('../models/Service');

// Get dashboard stats for admin
exports.getDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Get all hotels managed by this admin
    const hotels = await Hotel.find({ admin: adminId });
    const hotelIds = hotels.map(h => h._id);

    // Revenue total
    const factures = await Facture.find().populate({
      path: 'reservation',
      populate: { path: 'chambre' }
    });
    const totalCA = factures.reduce((sum, f) => sum + f.montantTotal, 0);

    // Chambres total
    const totalChambres = await Chambre.countDocuments({ hotel: { $in: hotelIds } });
    const occupees = await Chambre.countDocuments({ 
      hotel: { $in: hotelIds },
      statut: 'OCCUPEE' 
    });
    const tauxOccupation = totalChambres > 0 ? (occupees / totalChambres) * 100 : 0;

    // Reservations in progress
    const reservationsEnCours = await Reservation.countDocuments({
      statut: { $in: ['EN_ATTENTE', 'VALIDEE'] }
    });

    // Total clients
    const clientsUniques = await Reservation.distinct('client');

    res.json({
      revenuTotal: totalCA,
      nombreChambres: totalChambres,
      chambresOccupees: occupees,
      tauxOccupation: tauxOccupation.toFixed(2),
      reservationsEnCours,
      totalClients: clientsUniques.length,
      message: "Statistiques récupérées avec succès"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur statistiques", error: err.message });
  }
};

// Create a new hotel
exports.createHotel = async (req, res) => {
  const { nom, adresse, ville, telephone, email, description, etoiles, chambres } = req.body;

  try {
    // Créer l'hôtel
    const nouvelHotel = new Hotel({
      nom,
      adresse,
      ville,
      telephone,
      email,
      description,
      etoiles,
      admin: req.user.id
    });

    await nouvelHotel.save();

    // Créer les chambres si fournies
    if (chambres && Array.isArray(chambres) && chambres.length > 0) {
      const chambresAvecHotel = chambres.map(chambre => ({
        ...chambre,
        hotel: nouvelHotel._id
      }));

      await Chambre.insertMany(chambresAvecHotel);
    }

    // Récupérer l'hôtel avec ses chambres
    const hotelComplet = await Hotel.findById(nouvelHotel._id)
      .populate('services')
      .populate('admin', 'nom email');

    const chambresHotel = await Chambre.find({ hotel: nouvelHotel._id });

    res.status(201).json({
      message: "Hôtel créé avec succès",
      hotel: hotelComplet,
      chambres: chambresHotel
    });
  } catch (err) {
    res.status(400).json({ message: "Erreur création hôtel", error: err.message });
  }
};

// Get all hotels managed by admin
exports.getHotels = async (req, res) => {
  try {
    // If user is admin, show only their hotels. Otherwise show all (public view)
    const query = req.user ? { admin: req.user.id } : {};
    const hotels = await Hotel.find(query)
      .populate('services')
      .populate('admin', 'nom email');
    
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération hôtels", error: err.message });
  }
};

// Get hotel by ID (public route)
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('services')
      .populate('admin', 'nom email');
    
    if (!hotel) return res.status(404).json({ msg: 'Hôtel non trouvé' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération hôtel", error: err.message });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('services');

    if (!hotel) return res.status(404).json({ msg: 'Hôtel non trouvé' });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ message: "Erreur modification hôtel", error: err.message });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Hôtel non trouvé' });

    // Delete associated rooms and services
    await Chambre.deleteMany({ hotel: req.params.id });
    await Service.deleteMany({ hotel: req.params.id });

    res.json({ msg: 'Hôtel et ses données associées supprimés avec succès' });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression hôtel", error: err.message });
  }
};