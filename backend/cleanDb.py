#!/usr/bin/env python3
"""
Script pour nettoyer la base MongoDB
Usage: python cleanDb.py
"""

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, OperationFailure
import sys
import os
from dotenv import load_dotenv

# Charger variables d'environnement
load_dotenv()

def clean_database():
    """Nettoie toutes les collections de la base MongoDB"""
    
    try:
        # Connexion MongoDB
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Vérifier la connexion
        client.admin.command('ping')
        print("✅ Connecté à MongoDB")
        
        # Sélectionner la base de données
        db = client['hotel_db']
        
        # Collections à nettoyer
        collections = [
            'hotels',
            'users',
            'chambres',
            'reservations',
            'factures',
            'paiements',
            'services'
        ]
        
        # Supprimer chaque collection
        for col_name in collections:
            try:
                collection = db[col_name]
                result = collection.delete_many({})
                print(f"✅ {col_name}: {result.deleted_count} documents supprimés")
            except OperationFailure as e:
                if "ns not found" in str(e):
                    print(f"⏭️  {col_name}: n'existe pas (déjà vide)")
                else:
                    print(f"❌ Erreur {col_name}: {e}")
        
        # Afficher statistiques
        stats = db.command('dbstats')
        print(f"\n📊 Statistiques de la base:")
        print(f"   - Nombre de collections: {stats['collections']}")
        print(f"   - Taille totale: {stats['dataSize'] / 1024 / 1024:.2f} MB")
        
        print("\n🎉 Base de données nettoyée avec succès!")
        client.close()
        return True
        
    except ServerSelectionTimeoutError:
        print("❌ Erreur: Impossible de se connecter à MongoDB")
        print("   Assurez-vous que MongoDB est en cours d'exécution")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

if __name__ == "__main__":
    success = clean_database()
    sys.exit(0 if success else 1)
