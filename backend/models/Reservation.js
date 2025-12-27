const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  chambre: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chambre', 
    required: true 
  },
  datedebut: { type: Date, required: true },
  datefin: { type: Date, required: true },
 
statut: { 
  type: String, 
  enum: ['EN_ATTENTE', 'VALIDEE', 'ANNULEE', 'TERMINEE'], 
  default: 'EN_ATTENTE' 
}
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);