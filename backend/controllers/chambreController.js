const Chambre = require('../models/Chambre');

// @desc    Obtenir toutes les chambres (Public)
exports.getChambres = async (req, res) => {
  try {
    const chambres = await Chambre.find();
    res.json(chambres);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des chambres" });
  }
};

// @desc    Ajouter une chambre (Admin uniquement)
exports.createChambre = async (req, res) => {
  const { numero, type, capacite, prix, vue } = req.body;
  try {
    const nouvelleChambre = new Chambre({ numero, type, capacite, prix, vue });
    const chambreSauvegardee = await nouvelleChambre.save();
    res.status(201).json(chambreSauvegardee);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création", error: err.message });
  }
};

// Obtenir une seule chambre par son ID (Détails)
exports.getChambreById = async (req, res) => {
  try {
    const chambre = await Chambre.findById(req.params.id);
    if (!chambre) return res.status(404).json({ msg: "Chambre non trouvée" });
    res.json(chambre);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour une chambre (Admin uniquement)
exports.updateChambre = async (req, res) => {
  try {
    const chambreModifiee = await Chambre.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(chambreModifiee);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification" });
  }
};

// Supprimer une chambre (Admin uniquement)
exports.deleteChambre = async (req, res) => {
  try {
    await Chambre.findByIdAndDelete(req.params.id);
    res.json({ msg: "Chambre supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};