const mongoose = require('mongoose');
require('dotenv').config();

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
    
    const db = mongoose.connection.db;
    
    // Supprimer tous les index de la collection chambres sauf _id
    const chambresCollection = db.collection('chambres');
    const indexes = await chambresCollection.indexes();
    
    console.log('📋 Index existants:', indexes.map(i => i.name).join(', '));
    
    for (const index of indexes) {
      if (index.name !== '_id_') {
        console.log(`🗑️  Suppression de l'index: ${index.name}`);
        await chambresCollection.dropIndex(index.name);
      }
    }
    
    console.log('✅ Index supprimés avec succès');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
};

dropIndexes();
