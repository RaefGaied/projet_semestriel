const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const { check, validationResult } = require('express-validator');

// @route POST api/users/register
router.post('/register', [
  check('nom', 'Le nom est obligatoire').not().isEmpty(),
  check('email', 'Email non valide').isEmail(),
  check('password', '6 caractères minimum').isLength({ min: 6 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, register);

// @route POST api/users/login
router.post('/login', login);

module.exports = router;