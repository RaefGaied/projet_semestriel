const Reservation = require('../models/Reservation');
const Chambre = require('../models/Chambre');
const Facture = require('../models/Facture');
const Paiement = require('../models/Paiement');

// Create a reservation (Client)
exports.createReservation = async (req, res) => {
  const { chambre, datedebut, datefin, dateArrivee, dateDepart, nombrePersonnes, services } = req.body;

  try {
    // Support both date formats (datedebut/datefin and dateArrivee/dateDepart)
    const dateDebut = datedebut || dateArrivee;
    const dateFin = datefin || dateDepart;

    if (!dateDebut || !dateFin) {
      return res.status(400).json({ msg: 'Dates de début et fin requises' });
    }

    // Verify room exists and is available
    const chambreTrouvee = await Chambre.findById(chambre).populate('hotel');
    
    if (!chambreTrouvee) {
      return res.status(404).json({ msg: 'Chambre non trouvée' });
    }

    if (chambreTrouvee.statut !== 'DISPONIBLE') {
      return res.status(400).json({ msg: 'Chambre non disponible' });
    }

    const nouvelleReservation = new Reservation({
      client: req.user.id,
      chambre: chambre,
      datedebut: dateDebut,
      datefin: dateFin,
      services: services || []
    });

    await nouvelleReservation.save();
    
    // Update room status to occupied
    chambreTrouvee.statut = 'OCCUPEE';
    await chambreTrouvee.save();

    // Populate reservation details
    const reservationPopulee = await nouvelleReservation.populate([
      { path: 'client', select: 'nom email' },
      { path: 'chambre', populate: { path: 'hotel' } },
      { path: 'services' }
    ]);

    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation: reservationPopulee
    });
  } catch (err) {
    console.error('Erreur création réservation:', err);
    res.status(500).json({ message: "Erreur création réservation", error: err.message });
  }
};

// Get my reservations (Client)
exports.getMesReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.user.id })
      .populate([
        { path: 'client', select: 'nom email' },
        { path: 'chambre', populate: { path: 'hotel' } },
        { path: 'services' }
      ])
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération réservations", error: err.message });
  }
};

// Get all reservations (Admin)
exports.getAllReservations = async (req, res) => {
  try {
    const { statut, hotel } = req.query;
    let filter = {};

    if (statut) filter.statut = statut;

    const reservations = await Reservation.find(filter)
      .populate([
        { path: 'client', select: 'nom email' },
        { 
          path: 'chambre',
          populate: { path: 'hotel' }
        },
        { path: 'services' }
      ])
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération réservations", error: err.message });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate([
        { path: 'client', select: 'nom email telephone' },
        { 
          path: 'chambre',
          populate: { path: 'hotel' }
        },
        { path: 'services' }
      ]);

    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération réservation", error: err.message });
  }
};

// Cancel reservation (Client or Admin)
exports.annulerReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    // Verify authorization (client owns reservation or user is admin)
    if (req.user.role === 'client' && reservation.client.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Free up the room
    await Chambre.findByIdAndUpdate(reservation.chambre, { statut: 'DISPONIBLE' });

    // Cancel reservation
    reservation.statut = 'ANNULEE';
    await reservation.save();

    res.json({
      message: 'Réservation annulée et chambre libérée',
      reservation
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur annulation réservation", error: err.message });
  }
};

// Validate reservation (Admin only)
exports.validerReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut: 'VALIDEE' },
      { new: true }
    ).populate([
      { path: 'client' },
      { path: 'chambre' },
      { path: 'services' }
    ]);

    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    res.json({
      message: 'Réservation validée avec succès',
      reservation
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur validation réservation", error: err.message });
  }
};

// Complete stay (Check-out) (Admin only)
exports.terminerSejour = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    // Free up room
    await Chambre.findByIdAndUpdate(reservation.chambre, { statut: 'DISPONIBLE' });

    // Mark reservation as completed
    reservation.statut = 'TERMINEE';
    await reservation.save();

    res.json({
      message: 'Check-out effectué avec succès',
      reservation
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur check-out", error: err.message });
  }
};