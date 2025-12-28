const express = require('express');
const router = express.Router();
const { genererFacture, getFactureByReservation } = require('../controllers/factureController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Seul l'admin génère les factures
router.post('/', [auth, admin], genererFacture);
// Le client ou l'admin peut voir la facture
router.get('/:resId', auth, getFactureByReservation);

module.exports = router;