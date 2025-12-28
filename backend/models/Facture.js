const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
  reservation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Reservation', 
    unique: true, 
    required: true 
  },
  montantTotal: { type: Number, required: true },
  estPayee: { type: Boolean, default: false },
  dateEmission: { type: Date, default: Date.now },
  methodePaiement: { type: String, enum: ['ESPECES', 'CARTE', 'VIREMENT'], default: 'ESPECES' }
}, { timestamps: true });

module.exports = mongoose.model('Facture', factureSchema);