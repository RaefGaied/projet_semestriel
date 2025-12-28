const express = require('express');
const router = express.Router();
const { 
  getChambres, 
  createChambre, 
  getChambreById, 
  updateChambre, 
  deleteChambre 
} = require('../controllers/chambreController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', getChambres); 
router.get('/:id', getChambreById); 
router.post('/', [auth, admin], createChambre); // Admin seulement
router.put('/:id', [auth, admin], updateChambre); // Admin seulement
router.delete('/:id', [auth, admin], deleteChambre); // Admin seulement

module.exports = router;