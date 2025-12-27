const mongoose = require('mongoose');

const chambreSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['SIMPLE', 'DOUBLE', 'SUITE'], // Tiré de <<enumeration>> TypeChambre
    required: true 
  },
  capacite: { type: Number, required: true },
  prix: { type: Number, required: true },
  vue: { type: String },
  statut: { 
    type: String, 
    enum: ['DISPONIBLE', 'OCCUPEE', 'MAINTENANCE'], // Tiré de <<enumeration>> StatutChambre
    default: 'DISPONIBLE' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Chambre', chambreSchema);