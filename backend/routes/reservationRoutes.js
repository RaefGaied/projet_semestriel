const express = require('express');
const router = express.Router();
// AJOUT : annulerReservation et terminerSejour dans l'import
const { 
  createReservation, 
  getMesReservations, 
  annulerReservation, 
  terminerSejour 
} = require('../controllers/reservationController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Créer et Voir
router.post('/', auth, createReservation);
router.get('/me', auth, getMesReservations);

// Annulation (Client & Admin)
router.put('/annuler/:id', auth, annulerReservation);

// Check-out (Admin uniquement)
router.put('/terminer/:id', [auth, admin], terminerSejour);

module.exports = router;