const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Utilisation de la variable d'environnement définie dans .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur : ${error.message}`);
    process.exit(1); // Arrête le processus en cas d'échec [cite: 55]
  }
};

module.exports = connectDB;