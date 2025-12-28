const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Inscription
exports.register = async (req, res) => {
  const { nom, email, password, role } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Utilisateur déjà existant' });

    // Créer une nouvelle instance
    user = new User({ nom, email, password, role });
    await user.save();

    // Créer le Token JWT
    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          token,
          user: { 
            id: user._id, 
            nom: user.nom,
            email: user.email, 
            role: user.role 
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Identifiants invalides' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Identifiants invalides' });

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: { 
            id: user._id, 
            nom: user.nom,
            email: user.email, 
            role: user.role 
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};