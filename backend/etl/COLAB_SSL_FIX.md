# 🔐 Guide SSL/TLS pour Google Colab - MongoDB Atlas

## ⚠️ Erreur SSL courante sur Colab

```
SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error
```

**Cause**: Certificats SSL manquants ou version SSL incompatible

---

## ✅ SOLUTION POUR COLAB (Étape par étape)

### Étape 1: Setup initial (cellule 1)

```python
# Installation des packages avec certificats
!pip install -q pymongo pandas numpy openpyxl certifi

# Vérifier les certificats
!python -m certifi

print("✅ Setup terminé")
```

### Étape 2: Import avec certificats (cellule 2)

```python
import pandas as pd
import numpy as np
from pymongo import MongoClient
import certifi
import warnings
warnings.filterwarnings('ignore')

print("✅ Imports terminés")
```

### Étape 3: Configuration (cellule 3)

```python
# Configuration
MONGODB_ATLAS_URI = "mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

# Certificat CA
CA_CERT = certifi.where()

print(f"⚙️ Configuration prête")
print(f"🔒 Certificat CA: {CA_CERT[:50]}...")
```

### Étape 4: Connexion robuste (cellule 4) ⭐ IMPORTANTE

```python
print("📍 Connexion à MongoDB Atlas...\n")

try:
    # OPTION 1: Avec certificat CA (recommandé)
    print("🔄 Tentative avec certificat CA...")
    
    client = MongoClient(
        MONGODB_ATLAS_URI,
        tlsCAFile=certifi.where(),  # ⭐ Clé pour Colab!
        tlsAllowInvalidCertificates=False,
        tlsAllowInvalidHostnames=False,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000,
        socketTimeoutMS=30000,
        maxPoolSize=50
    )
    
    # Test de ping
    client.admin.command('ping')
    print("✅ CONNECTÉ avec certificat CA!")
    
except Exception as e1:
    print(f"⚠️  Échec avec certificat CA: {type(e1).__name__}")
    
    # OPTION 2: Fallback sans validation SSL (moins sûr)
    print("🔄 Tentative sans validation SSL...")
    
    try:
        client = MongoClient(
            MONGODB_ATLAS_URI,
            tlsAllowInvalidCertificates=True,  # ⚠️ Mode insécurisé
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000
        )
        
        client.admin.command('ping')
        print("✅ CONNECTÉ en mode sécurité relaxée (⚠️ moins sûr)")
        print("   Recommandation: Utiliser Option 1 en production")
        
    except Exception as e2:
        print(f"❌ Échec même en mode insécurisé")
        print(f"   Erreur: {e2}")
        raise

# Connexion réussie
db = client[DATABASE_NAME]
collections = db.list_collection_names()

print(f"\n✅ Base de données: {DATABASE_NAME}")
print(f"📊 Collections: {len(collections)}")
for col in collections:
    count = db[col].count_documents({})
    print(f"   - {col}: {count}")

print("\n✅ PRÊT POUR ETL!\n")
```

---

## 🔧 Si problèmes persistent

### 1. Redémarrer le kernel Colab
```python
# Dans une cellule:
from google.colab import runtime
runtime.unassign()

# Ou cliquer: Runtime → Disconnect and delete all
```

### 2. Nettoyer et réinstaller
```python
!pip uninstall pymongo certifi -y
!pip install pymongo==4.6.0 certifi --upgrade
```

### 3. Tester la connexion brute
```python
import socket
import ssl

hostname = "cluster0.v6scg.mongodb.net"
print(f"🔄 Test DNS: {hostname}")
ip = socket.gethostbyname(hostname)
print(f"✅ IP: {ip}")

# Test SSL
context = ssl.create_default_context()
with socket.create_connection((hostname, 27017), timeout=5) as sock:
    with context.wrap_socket(sock, server_hostname=hostname) as ssock:
        print(f"✅ SSL OK - Protocole: {ssock.version()}")
```

### 4. Activer Google Drive pour exporter
```python
from google.colab import drive
drive.mount('/content/drive')

# Puis exporter:
import shutil
shutil.copy('reservations_clean.csv', '/content/drive/MyDrive/')
```

---

## 📋 Checklist Colab

- ✅ `!pip install pymongo certifi`
- ✅ `import certifi`
- ✅ `tlsCAFile=certifi.where()` dans MongoClient
- ✅ `serverSelectionTimeoutMS=30000` (timeout long)
- ✅ Vérifier Network Access: `0.0.0.0/0`
- ✅ Redémarrer le kernel si problème

---

## 🎯 Code complet pour Colab (Copy-Paste)

### Cell 1: Setup
```python
!pip install -q pymongo pandas numpy openpyxl certifi
print("✅ Packages installés")
```

### Cell 2: Configuration complète
```python
import pandas as pd
import numpy as np
from pymongo import MongoClient
import certifi
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

MONGODB_ATLAS_URI = "mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

print("✅ Configuration prête")
```

### Cell 3: Connexion
```python
print("📍 Connexion à MongoDB Atlas...")

client = MongoClient(
    MONGODB_ATLAS_URI,
    tlsCAFile=certifi.where(),  # ⭐ Important!
    tlsAllowInvalidCertificates=False,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000
)

client.admin.command('ping')
print("✅ Connecté!")

db = client[DATABASE_NAME]
print(f"✅ Collections: {db.list_collection_names()}")
```

### Cell 4+: Continuation
Utiliser les autres cellules du notebook `etl_transformation.ipynb`

---

## 📊 Alternatives si SSL toujours bloqué

### Option A: Utiliser local MongoDB + migration après
```bash
1. Utiliser MongoDB local (Compass)
2. Exécuter seed.js localement
3. Migrer vers Atlas après
4. Continuer ETL sur Colab
```

### Option B: Exécuter ETL localement
```bash
cd backend/etl
python transformation_etl.py
# Les fichiers CSV seront générés localement
```

### Option C: Google Colab avec Drive
```python
# Importer fichiers depuis Drive
from google.colab import drive
drive.mount('/content/drive')

# Lire depuis CSV
df = pd.read_csv('/content/drive/MyDrive/reservations.csv')

# Traiter sans MongoDB
# Exporter résultats
```

---

## ✨ Résumé

**Le code clé pour Colab:**

```python
import certifi
from pymongo import MongoClient

client = MongoClient(
    URI,
    tlsCAFile=certifi.where(),  # La clé!
    serverSelectionTimeoutMS=30000
)
```

Ça doit marcher! 🎯
