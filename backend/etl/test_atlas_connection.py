#!/usr/bin/env python3
"""
TEST DE CONNEXION MONGODB ATLAS
Script pour diagnostiquer les problèmes de connexion
"""

import sys
import time

# Vérifier les imports
print("=" * 80)
print("🔍 TEST DE CONNEXION MONGODB ATLAS")
print("=" * 80)

print("\n1️⃣ VÉRIFICATION DES PACKAGES...")
try:
    import pymongo
    print(f"   ✅ pymongo {pymongo.__version__}")
except ImportError:
    print("   ❌ pymongo non installé: pip install pymongo")
    sys.exit(1)

try:
    import pandas as pd
    print(f"   ✅ pandas {pd.__version__}")
except ImportError:
    print("   ⚠️  pandas non installé (optionnel)")

# Configuration
MONGODB_ATLAS_URI = "mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

print("\n2️⃣ VÉRIFICATION DE L'URI...")

# Vérifier l'URI
if "PASSWORD" in MONGODB_ATLAS_URI or "YOUR_PASSWORD" in MONGODB_ATLAS_URI:
    print("   ❌ ERREUR: URI contient 'PASSWORD' ou 'YOUR_PASSWORD'")
    print("\n   ⚠️  ACTION REQUISE:")
    print("      1. Modifier ce fichier: test_atlas_connection.py")
    print("      2. Ligne 17: Remplacer PASSWORD par votre mot de passe réel")
    print("      3. Exemple: Raef:MonMotDePasse123@cluster0...")
    print("\n      Vous pouvez obtenir l'URI depuis:")
    print("      - MongoDB Atlas → Cluster0 → Connect")
    print("      - Sélectionner 'Python' → Copier l'URI")
    sys.exit(1)
else:
    # Masquer le password
    uri_parts = MONGODB_ATLAS_URI.split('@')
    user_part = uri_parts[0].split(':')
    masked = f"{user_part[0]}:{user_part[1][:3]}***@{uri_parts[1]}"
    print(f"   ✅ URI valide: {masked}")

print("\n3️⃣ CONNEXION À MONGODB ATLAS...")
print(f"   Cluster: cluster0.v6scg.mongodb.net")
print(f"   Utilisateur: Raef")
print(f"   Base de données: {DATABASE_NAME}")

try:
    from pymongo import MongoClient
    
    print("\n   🔄 Tentative de connexion...")
    print("      (timeout: 10 secondes)")
    
    # Options de connexion robustes
    client = MongoClient(
        MONGODB_ATLAS_URI,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=30000,
        retryWrites=True,
        maxPoolSize=50
    )
    
    # Test de ping
    result = client.admin.command('ping')
    print("\n   ✅ CONNEXION RÉUSSIE!")
    print(f"      Réponse du serveur: {result}")
    
    # Vérifier la base de données
    db = client[DATABASE_NAME]
    collections = db.list_collection_names()
    
    print(f"\n4️⃣ VÉRIFICATION DE LA BASE DE DONNÉES...")
    print(f"   ✅ Base '{DATABASE_NAME}' accessible")
    print(f"   📊 Collections trouvées: {len(collections)}")
    
    if collections:
        print(f"\n   Détails des collections:")
        for col in collections:
            count = db[col].count_documents({})
            print(f"      - {col}: {count} documents")
    else:
        print(f"      ⚠️  Aucune collection trouvée")
        print(f"      Vous devez d'abord remplir la base avec seed.js")
    
    # Afficher les informations du serveur
    print(f"\n5️⃣ INFORMATIONS DU SERVEUR...")
    server_info = client.server_info()
    print(f"   ✅ Version MongoDB: {server_info.get('version', 'N/A')}")
    
    # Afficher les statistiques
    print(f"\n6️⃣ STATISTIQUES DE CONNEXION...")
    print(f"   ✅ État: CONNECTÉ")
    print(f"   ✅ Pool de connexions: configuré")
    print(f"   ✅ Retry writes: activé")
    
    client.close()
    
    print("\n" + "=" * 80)
    print("✅ TOUS LES TESTS RÉUSSIS")
    print("=" * 80)
    print("\n🚀 Vous pouvez maintenant exécuter le notebook ETL!")
    print("\nProchaines étapes:")
    print("  1. Ouvrir Google Colab")
    print("  2. Copier contenu du notebook: etl_transformation.ipynb")
    print("  3. Exécuter cellule par cellule")
    print("  4. Télécharger les fichiers CSV nettoyés")
    print("\n" + "=" * 80 + "\n")
    
except Exception as e:
    print(f"\n   ❌ ERREUR DE CONNEXION")
    print(f"      Type: {type(e).__name__}")
    print(f"      Message: {str(e)}")
    
    print(f"\n7️⃣ TROUBLESHOOTING...")
    
    error_str = str(e).lower()
    
    if "authentication" in error_str:
        print(f"   ❌ ERREUR D'AUTHENTIFICATION")
        print(f"      - Vérifier le mot de passe")
        print(f"      - Vérifier l'utilisateur 'Raef' existe")
        print(f"      - Réinitialiser le password dans MongoDB Atlas")
    
    elif "timeout" in error_str or "connection" in error_str:
        print(f"   ❌ ERREUR DE CONNEXION/TIMEOUT")
        print(f"      - Vérifier la connexion internet")
        print(f"      - Vérifier Network Access: 0.0.0.0/0 dans MongoDB Atlas")
        print(f"      - Vérifier que le cluster est ACTIVE (vert)")
        print(f"      - Attendre 1-2 minutes si cluster en démarrage")
    
    elif "ssl" in error_str or "tls" in error_str:
        print(f"   ❌ ERREUR SSL/TLS")
        print(f"      - Vérifier la connexion internet")
        print(f"      - Peut être un problème firewall")
        print(f"      - Vérifier les certificats SSL")
    
    elif "not found" in error_str:
        print(f"   ❌ BASE DE DONNÉES NON TROUVÉE")
        print(f"      - Vérifier que 'gestion-hoteliere' existe")
        print(f"      - Sinon: créer avec seed.js en local")
    
    else:
        print(f"   ℹ️  Erreur inconnue - voir message ci-dessus")
    
    print(f"\n🔧 ACTIONS RECOMMANDÉES:")
    print(f"   1. Vérifier MongoDB Atlas Dashboard")
    print(f"   2. Vérifier Network Access: 0.0.0.0/0")
    print(f"   3. Vérifier que le cluster0 est ACTIVE")
    print(f"   4. Vérifier le password pour l'utilisateur Raef")
    print(f"   5. Relancer ce test après corrections")
    
    print("\n📖 Aide: Voir MONGODB_ATLAS_CONFIG.md pour solutions détaillées")
    print("\n" + "=" * 80 + "\n")
    
    sys.exit(1)
