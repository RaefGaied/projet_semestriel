const Facture = require('../models/Facture');
const Chambre = require('../models/Chambre');
const Reservation = require('../models/Reservation');

exports.getDashboardStats = async (req, res) => {
  try {
    //  Somme totale des factures (Chiffre d'affaires)
    const factures = await Facture.find();
    const totalCA = factures.reduce((sum, f) => sum + f.montantTotal, 0);

    //  Taux d'occupation
    const totalChambres = await Chambre.countDocuments();
    const occupées = await Chambre.countDocuments({ statut: 'OCCUPEE' });
    const taux = totalChambres > 0 ? (occupées / totalChambres) * 100 : 0;

    res.json({
      revenuTotal: totalCA,
      nombreChambres: totalChambres,
      chambresOccupees: occupées,
      tauxOccupation: `${taux.toFixed(2)}%`,
      message: "Données récupérées avec succès"
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur statistiques" });
  }
};