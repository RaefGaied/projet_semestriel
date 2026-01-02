#!/usr/bin/env python3
"""
FIX SSL/TLS - MongoDB Atlas Connection
Script pour corriger les erreurs SSL/TLS courantes
"""

import sys
import ssl
import socket

print("=" * 80)
print("🔧 DIAGNOSTIC ET FIX SSL/TLS - MONGODB ATLAS")
print("=" * 80)

# 1. Vérifier SSL sur le système
print("\n1️⃣ VÉRIFICATION SSL SYSTÈME...")
try:
    import ssl
    print(f"   ✅ SSL version: {ssl.OPENSSL_VERSION}")
    print(f"   ✅ Module SSL: disponible")
except ImportError:
    print("   ❌ Module SSL non disponible")

# 2. Tester la connexion au cluster MongoDB
print("\n2️⃣ TEST DE CONNEXION AU CLUSTER...")
try:
    # Essayer de résoudre le hostname
    hostname = "cluster0.v6scg.mongodb.net"
    
    print(f"   🔄 Résolution DNS: {hostname}")
    ip = socket.gethostbyname(hostname)
    print(f"   ✅ IP résolvée: {ip}")
    
    # Essayer une connexion SSL basique
    print(f"   🔄 Test SSL/TLS sur port 27017...")
    
    context = ssl.create_default_context()
    with socket.create_connection((hostname, 27017), timeout=10) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            print(f"   ✅ SSL/TLS OK")
            print(f"      Protocole: {ssock.version()}")
            print(f"      Cipher: {ssock.cipher()[0]}")

except socket.gaierror:
    print(f"   ❌ ERREUR DNS: Impossible de résoudre {hostname}")
    print(f"      Solution: Vérifier votre connexion internet")
    
except socket.timeout:
    print(f"   ⚠️  TIMEOUT: Pas de réponse du serveur")
    print(f"      Solution: Le cluster peut être en pause ou inaccessible")
    
except ssl.SSLError as e:
    print(f"   ❌ ERREUR SSL: {e}")
    print(f"      Solution: Voir solutions ci-dessous")
    
except Exception as e:
    print(f"   ⚠️  ERREUR: {type(e).__name__}: {e}")

# 3. Tester les certificats
print("\n3️⃣ VÉRIFICATION DES CERTIFICATS...")
try:
    import certifi
    print(f"   ✅ certifi installé: {certifi.__version__}")
    print(f"   ✅ Chemin CA: {certifi.where()[:50]}...")
except ImportError:
    print("   ⚠️  certifi non installé")
    print("      À installer pour Colab: pip install certifi")

# 4. Tester pymongo
print("\n4️⃣ VÉRIFICATION PYMONGO...")
try:
    import pymongo
    print(f"   ✅ pymongo {pymongo.__version__}")
    
    # Tester avec les bonnes options
    from pymongo import MongoClient
    
    MONGODB_ATLAS_URI = "mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
    
    print("\n   🔄 Tentative de connexion pymongo...")
    
    # Option 1: Connexion standard
    try:
        client = MongoClient(
            MONGODB_ATLAS_URI,
            serverSelectionTimeoutMS=15000,
            connectTimeoutMS=15000,
            socketTimeoutMS=15000,
            tlsAllowInvalidCertificates=False
        )
        client.admin.command('ping')
        print("   ✅ CONNEXION RÉUSSIE (Configuration standard)")
        client.close()
        
    except ssl.SSLError as e:
        print(f"   ❌ Erreur SSL avec config standard")
        
        # Option 2: Essayer avec certificats désactivés (moins sûr)
        print("\n   🔄 Tentative avec tlsAllowInvalidCertificates=True...")
        try:
            client = MongoClient(
                MONGODB_ATLAS_URI,
                serverSelectionTimeoutMS=15000,
                connectTimeoutMS=15000,
                socketTimeoutMS=15000,
                tlsAllowInvalidCertificates=True  # ⚠️ Moins sûr
            )
            client.admin.command('ping')
            print("   ✅ CONNEXION RÉUSSIE (Mode sécurité relaxée)")
            print("   ⚠️  ATTENTION: Mode insécurisé - à éviter en production")
            client.close()
            
        except Exception as e2:
            print(f"   ❌ Échec même avec validation SSL désactivée")
            print(f"      Erreur: {type(e2).__name__}")

except ImportError:
    print("   ❌ pymongo non installé")
    print("      À installer: pip install pymongo")

# 5. Solutions finales
print("\n" + "=" * 80)
print("💡 SOLUTIONS RECOMMANDÉES")
print("=" * 80)

print("""
SI ERREUR SSL/TLS PERSISTE:

1. VÉRIFIER LES CERTIFICATS:
   - Windows: Vérifier que les certificats système sont à jour
   - Linux/Mac: pip install --upgrade certifi
   - Colab: !pip install certifi

2. METTRE À JOUR LES PACKAGES:
   pip install --upgrade pymongo certifi ssl

3. UTILISER CERTIFI (Colab):
   import certifi
   client = MongoClient(
       URI,
       tlsCAFile=certifi.where()
   )

4. VÉRIFIER MONGODB ATLAS:
   - Dashboard → Cluster0 → Status: ACTIVE ✓
   - Security → Network Access: 0.0.0.0/0 ✓
   - Security → Database Users: Raef existe ✓

5. EN DERNIER RECOURS:
   Utiliser tlsAllowInvalidCertificates=True
   (⚠️  Moins sûr, à éviter en production)

6. REDÉMARRER:
   - Redémarrer le kernel Jupyter/Colab
   - Redémarrer l'ordinateur
   - Attendre quelques minutes puis réessayer
""")

print("=" * 80)
print("✅ Relancez votre notebook après les corrections")
print("=" * 80 + "\n")
