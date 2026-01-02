#!/usr/bin/env python3
"""
Script pour nettoyer MongoDB Atlas
Usage: python cleanDb_Atlas.py
"""

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, OperationFailure
import sys
import os
from dotenv import load_dotenv

# Charger variables d'environnement
load_dotenv()

def clean_database_atlas():
    """Nettoie MongoDB Atlas"""
    
    try:
        # Connexion MongoDB Atlas
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://admin:password@cluster.mongodb.net/gestion-hoteliere')
        
        print(f"🔌 Connexion à Atlas...")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
        
        # Vérifier la connexion
        client.admin.command('ping')
        print("✅ Connecté à MongoDB Atlas")
        
        # Sélectionner la base de données
        db = client['gestion-hoteliere']
        
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
        
        print("\n🧹 Nettoyage des collections:\n")
        
        # Supprimer chaque collection
        total_deleted = 0
        for col_name in collections:
            try:
                collection = db[col_name]
                result = collection.delete_many({})
                total_deleted += result.deleted_count
                print(f"   ✅ {col_name:15} → {result.deleted_count:4} documents supprimés")
            except OperationFailure as e:
                if "ns not found" in str(e):
                    print(f"   ⏭️  {col_name:15} → n'existe pas (vide)")
                else:
                    print(f"   ❌ {col_name:15} → {e}")
        
        # Afficher statistiques
        stats = db.command('dbstats')
        print(f"\n📊 RÉSUMÉ:")
        print(f"   📌 Total supprimés: {total_deleted} documents")
        print(f"   📌 Collections restantes: {stats['collections']}")
        print(f"   📌 Taille: {stats['dataSize'] / 1024 / 1024:.2f} MB")
        
        print("\n🎉 Base nettoyée avec succès!")
        client.close()
        return True
        
    except ServerSelectionTimeoutError:
        print("❌ Erreur: Impossible de se connecter à MongoDB Atlas")
        print("   Vérifiez:")
        print("   - Votre connexion internet")
        print("   - L'URI MONGODB_URI dans .env")
        print("   - Les autorisations réseau dans Atlas")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

if __name__ == "__main__":
    success = clean_database_atlas()
    sys.exit(0 if success else 1)
