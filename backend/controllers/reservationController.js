const Reservation = require('../models/Reservation');
const Chambre = require('../models/Chambre');

// Créer une réservation (Client)
exports.createReservation = async (req, res) => {
  // On utilise "chambre" pour correspondre exactement à votre test Postman
  const { chambre, datedebut, datefin } = req.body;

  try {
    const chambreTrouvee = await Chambre.findById(chambre);
    
    if (!chambreTrouvee || chambreTrouvee.statut !== 'DISPONIBLE') {
      return res.status(400).json({ msg: 'Chambre non disponible' });
    }

    const nouvelleReservation = new Reservation({
      client: req.user.id, // Vient du middleware auth
      chambre: chambre,
      datedebut,
      datefin
    });

    await nouvelleReservation.save();
    
    // Bloquer la chambre
    chambreTrouvee.statut = 'OCCUPEE';
    await chambreTrouvee.save();

    res.status(201).json(nouvelleReservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Obtenir mes réservations (Client) - BIEN EXPORTÉ ICI
exports.getMesReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.user.id }).populate('chambre');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ... (gardez votre code existant au début)

// Annuler une réservation
exports.annulerReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ msg: 'Réservation non trouvée' });

    //  Remettre la chambre en DISPONIBLE
    await Chambre.findByIdAndUpdate(reservation.chambre, { statut: 'DISPONIBLE' });

    //  Changer le statut de la réservation
    reservation.statut = 'ANNULEE';
    await reservation.save();

    res.json({ msg: 'Réservation annulée et chambre libérée', reservation });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Terminer un séjour (Check-out)
exports.terminerSejour = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ msg: 'Réservation non trouvée' });

    //  Libérer la chambre
    await Chambre.findByIdAndUpdate(reservation.chambre, { statut: 'DISPONIBLE' });

    //  Marquer la réservation comme terminée
    reservation.statut = 'TERMINEE';
    await reservation.save();

    res.json({ msg: 'Check-out effectué avec succès', reservation });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};