const express = require('express');
const router = express.Router();
const { 
  createHotel, 
  getHotels, 
  getHotelById,
  updateHotel, 
  deleteHotel 
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes - anyone can view hotels
router.get('/', getHotels);
router.get('/:id', getHotelById);

// Admin routes - require authentication and admin role
router.post('/', [auth, admin], createHotel);
router.put('/:id', [auth, admin], updateHotel);
router.delete('/:id', [auth, admin], deleteHotel);

module.exports = router;
