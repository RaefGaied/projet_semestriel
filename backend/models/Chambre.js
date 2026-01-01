const mongoose = require('mongoose');

const chambreSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  numero: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['SIMPLE', 'DOUBLE', 'SUITE'],
    required: true 
  },
  capacite: { type: Number, required: true },
  prix: { type: Number, required: true },
  vue: { type: String },
  statut: { 
    type: String, 
    enum: ['DISPONIBLE', 'OCCUPEE', 'MAINTENANCE'],
    default: 'DISPONIBLE' 
  }
}, { timestamps: true });

// Compound unique index - numéro unique par hôtel (pas globalement)
chambreSchema.index({ hotel: 1, numero: 1 }, { unique: true });

module.exports = mongoose.model('Chambre', chambreSchema);