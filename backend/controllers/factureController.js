const Facture = require('../models/Facture');
const Reservation = require('../models/Reservation');

exports.genererFacture = async (req, res) => {
  const { reservationId } = req.body;

  try {
    //  Récupérer la réservation et les détails de la chambre associée
    const reservation = await Reservation.findById(reservationId).populate('chambre');
    
    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    //  Vérifier si une facture existe déjà (votre test réussi)
    const factureExistante = await Facture.findOne({ reservation: reservationId });
    if (factureExistante) {
      return res.status(400).json({ msg: 'Une facture existe déjà pour cette réservation' });
    }

    //  Calcul automatique de la durée et du prix
    const debut = new Date(reservation.datedebut);
    const fin = new Date(reservation.datefin);
    const diffJours = Math.ceil(Math.abs(fin - debut) / (1000 * 60 * 60 * 24)) || 1;

    // Formule mathématique du montant total
    // $$MontantTotal = PrixChambre \times NombreDeJours$$
    const montantCalcule = reservation.chambre.prix * diffJours;

    //  Enregistrement de la facture automatisée
    const nouvelleFacture = new Facture({
      reservation: reservationId,
      montantTotal: montantCalcule
    });

    await nouvelleFacture.save();

    res.status(201).json({
      message: "Facture générée avec succès",
      recapitulatif: {
        nuits: diffJours,
        prixUnitaire: reservation.chambre.prix,
        total: montantCalcule
      },
      facture: nouvelleFacture
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Obtenir la facture d'une réservation (Utile pour le profil Client)
exports.getFactureByReservation = async (req, res) => {
  try {
    const facture = await Facture.findOne({ reservation: req.params.resId }).populate('reservation');
    if (!facture) return res.status(404).json({ msg: 'Facture non trouvée' });
    res.json(facture);
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};