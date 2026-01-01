const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const clearDatabase = async () => {
  try {
    // Connexion MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔌 Connecté à MongoDB');

    // Lister toutes les collections
    const collections = [
      'hotels',
      'users',
      'chambres',
      'reservations',
      'factures',
      'paiements',
      'services'
    ];

    for (const collName of collections) {
      try {
        // Utiliser dropCollection pour supprimer indexes aussi
        await mongoose.connection.collection(collName).drop();
        console.log(`✅ ${collName} supprimée`);
      } catch (err) {
        if (err.message.includes('ns not found')) {
          console.log(`⏭️  ${collName} n'existe pas`);
        } else {
          console.error(`❌ Erreur suppression ${collName}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Base de données nettoyée avec succès!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

clearDatabase();
