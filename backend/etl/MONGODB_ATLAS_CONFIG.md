# 🔗 Configuration MongoDB Atlas - Connexion ETL

## ⚠️ ERREUR COURANTE: SSL/TLS Connection Error

Si vous recevez l'erreur:
```
SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error
```

**Solutions:**

---

## 1️⃣ Vérifier l'URI MongoDB Atlas

### Votre URI actuelle:
```
mongodb+srv://Raef:PASSWORD@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0
```

### ⚠️ Remplacer PASSWORD par votre mot de passe réel

**Exemple valide:**
```
mongodb+srv://Raef:MonMotDePasse123@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0
```

---

## 2️⃣ Vérifier le Cluster sur MongoDB Atlas

### Étapes:
1. Aller sur [MongoDB Atlas](https://atlas.mongodb.com)
2. Se connecter avec votre compte
3. Cliquer sur **Clusters**
4. Vérifier que **cluster0** est **ACTIVE** (vert) ✅
   - Si rouge/gris → Attendre ou redémarrer
   - Si supprimé → Recréer le cluster

### Connexion URI depuis MongoDB Atlas:
1. Cluster → **Connect**
2. Sélectionner **Python**
3. Copier l'URI complète
4. Remplacer dans le notebook

---

## 3️⃣ Vérifier Network Access

### Paramètres réseau Atlas:
1. Aller dans **Security → Network Access**
2. Vérifier que **0.0.0.0/0** est autorisé
   - Status: **Active** (vert)
   - Description: "Anywhere"

### Si problème:
1. Supprimer l'accès actuel
2. Ajouter **ADD IP ADDRESS**
3. Sélectionner **Allow access from anywhere**
4. Confirmer

---

## 4️⃣ Vérifier les Credentials (Utilisateur)

### Vérifier l'utilisateur Raef:
1. Aller dans **Security → Database Users**
2. Chercher utilisateur **Raef**
3. Vérifier le password

### Si oublié:
1. Cliquer sur les 3 points (...)
2. **Edit Password**
3. Générer nouveau password
4. Copier et mettre à jour l'URI

---

## 5️⃣ Test de Connexion - Utiliser cette cellule Colab

### Copier-coller dans Colab:

```python
# Test simple de connexion
import pymongo

URI_TEST = "mongodb+srv://Raef:PASSWORD@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority"

# Remplacer PASSWORD ↑↑↑

try:
    client = pymongo.MongoClient(
        URI_TEST,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000
    )
    
    # Test de ping
    result = client.admin.command('ping')
    print("✅ CONNECTÉ AVEC SUCCÈS!")
    print(f"Réponse: {result}")
    
    # Lister les collections
    db = client['gestion-hoteliere']
    collections = db.list_collection_names()
    print(f"✅ Collections: {collections}")
    
except Exception as e:
    print(f"❌ ERREUR: {e}")
    print("\nVérifier:")
    print("  1. Le password est correct")
    print("  2. Cluster0 est ACTIVE (vert)")
    print("  3. Network Access: 0.0.0.0/0 autorisé")
```

---

## 6️⃣ Erreurs Spécifiques et Solutions

### Erreur: "Authentication failed"
```
Solution:
- Vérifier le mot de passe dans l'URI
- Vérifier que l'utilisateur "Raef" existe
- Réinitialiser le password dans Database Users
```

### Erreur: "Connection timeout"
```
Solution:
- Vérifier la connexion internet
- Vérifier Network Access: 0.0.0.0/0
- Vérifier que le cluster n'est pas en pause
- Augmenter timeout: serverSelectionTimeoutMS=30000
```

### Erreur: "SSL: TLSV1_ALERT_INTERNAL_ERROR"
```
Solution (dans le notebook):
client = MongoClient(
    URI,
    tlsAllowInvalidCertificates=False,  # Important!
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=30000
)
```

### Erreur: "database not found"
```
Solution:
- Vérifier que 'gestion-hoteliere' existe
- Si non existente → créer avec:
  db = client['gestion-hoteliere']
  db.create_collection('reservations')
```

---

## 7️⃣ Environnement Colab - Points d'attention

### Issue: Colab peut être bloqué par firewall
```python
# Solution: utiliser certificats système
import certifi

client = MongoClient(
    MONGODB_ATLAS_URI,
    tlsCAFile=certifi.where()  # Important pour Colab!
)
```

### Accès aux fichiers Colab
```python
# Pour Google Drive:
from google.colab import drive
drive.mount('/content/drive')

# Exporter vers Drive:
import shutil
shutil.copy('reservations_clean.csv', '/content/drive/MyDrive/')
```

---

## 8️⃣ Checklist Avant Exécution

- ✅ **URI MongoDB Atlas** configurée correctement
  - [ ] Utilisateur: `Raef`
  - [ ] Mot de passe: `***` (remplacé)
  - [ ] Cluster: `cluster0.v6scg`
  - [ ] Base: `gestion-hoteliere`

- ✅ **MongoDB Atlas**
  - [ ] Cluster0 en status ACTIVE
  - [ ] Network Access: 0.0.0.0/0 autorisé
  - [ ] Utilisateur Raef avec password correct

- ✅ **Notebook Setup**
  - [ ] pip install pymongo pandas numpy openpyxl
  - [ ] Packages importés sans erreur
  - [ ] Cellule de test ping réussie

---

## 🎯 Après Configuration

Une fois connecté ✅:

1. Exécuter cell 4: Connexion à MongoDB Atlas
2. Exécuter cell 5: Extraction des données
3. Continuer avec exploration (PART 1)
4. Nettoyage (PART 2)
5. Agrégations (PART 3)
6. Export CSV

**Durée totale: ~5-10 minutes**

---

## 📞 Support

Si vous avez toujours des problèmes:

1. **Test de ping** (test cellule ci-dessus)
2. **Vérifier MongoDB Atlas Dashboard**
3. **Lire les logs du cluster** (Monitoring)
4. **Contacter MongoDB Support** si infrastructure problème

---

**✅ Prêt à vous connecter?**

Replacez le password dans l'URI et exécutez le notebook! 🚀
