# 📚 INDEX - ETL BI Mini-projet Hotel

## 🎯 Objectif
Appliquer les 30 points du TP **ETL et Nettoyage des données** sur le projet hotel MERN.

---

## 📁 Structure des fichiers

### 📓 **NOTEBOOKS JUPYTER** (À exécuter)

| Fichier | Description | Utilisation |
|---------|-------------|------------|
| **etl_transformation.ipynb** | ⭐ Notebook complet prêt à l'emploi (Google Colab) | 🎯 **À UTILISER** |
| colab_notebook.ipynb | Version alternative du notebook | Backup |

### 🐍 **SCRIPTS PYTHON** (Exécution locale/Colab)

| Fichier | Description | Utilisation |
|---------|-------------|------------|
| **exploration_data.py** | Explore les données brutes (PART 1 - 10 points) | `python exploration_data.py` |
| **transformation_etl.py** | Nettoyage complet ETL (PART 2-3 - 20 points) | `python transformation_etl.py` |
| **test_atlas_connection.py** | Teste la connexion MongoDB Atlas | `python test_atlas_connection.py` |
| **fix_ssl_tls.py** | Diagnostique les problèmes SSL/TLS | `python fix_ssl_tls.py` |
| colab_notebook.py | Version texte du notebook | Référence |

### 📖 **GUIDES & DOCUMENTATION** (À lire)

| Fichier | Contenu | Public |
|---------|---------|--------|
| **COLAB_COMPLETE_GUIDE.md** | ⭐ Guide complet Google Colab (copier-coller) | Vous! |
| **COLAB_SSL_FIX.md** | Solutions SSL/TLS pour Colab | Si erreur SSL |
| **MONGODB_ATLAS_CONFIG.md** | Configuration MongoDB Atlas | Si erreur connexion |
| **ETL_PROCESS.md** | Architecture complète ETL | Documentation |
| **README_COLAB.md** | Guide détaillé + cellules Colab | Référence |
| **SUMMARY.md** | Résumé projet + points couverts | Synthèse |

### ⚙️ **CONFIGURATION**

| Fichier | Description |
|---------|-------------|
| **requirements.txt** | Dépendances Python (`pip install -r requirements.txt`) |
| **run_etl.bat** | Script Windows pour lancer ETL local |

---

## 🚀 DÉMARRAGE RAPIDE

### Option 1: Google Colab ⭐ (RECOMMANDÉ)

**1️⃣ Ouvrir Google Colab**
```
https://colab.research.google.com
```

**2️⃣ Créer un nouveau notebook**
```
File → New notebook
```

**3️⃣ Copier-coller du guide Colab**
```
Lire: COLAB_COMPLETE_GUIDE.md
Copier les 9 cellules dans Colab
Exécuter!
```

**⏱️ Durée: 30 minutes**
**📦 Résultat: 6 fichiers CSV + Excel**

---

### Option 2: Exécution locale

**1️⃣ Tester la connexion**
```bash
cd backend/etl
python test_atlas_connection.py
```

**2️⃣ Lancer l'exploration**
```bash
python exploration_data.py
```

**3️⃣ Lancer le nettoyage**
```bash
python transformation_etl.py
```

**⏱️ Durée: 20 minutes**
**📦 Résultat: Fichiers CSV dans le dossier courant**

---

### Option 3: Jupyter local

```bash
cd backend/etl
pip install -r requirements.txt
jupyter notebook etl_transformation.ipynb
```

---

## 📊 COVERAGE DU TP

### **PART 1: EXPLORATION (10 points)** ✅
```
✅ 1. Afficher 10 premières lignes
✅ 2. Afficher info() générale
✅ 3. Statistiques descriptives
✅ 4. Valeurs manquantes
✅ 5. Nombre de doublons
✅ 6. Distribution par statut
✅ 7. Distribution par type/région
✅ 8. Histogramme montants
✅ 9. Boxplot outliers
✅ 10. Évolution dans le temps
```

### **PART 2: NETTOYAGE (13 points)** ✅
```
✅ 11. Supprimer annulées
✅ 12. Remplir montants manquants
✅ 13. Convertir dates
✅ 14. Colonne montant_abs
✅ 15-16. Année/mois
✅ 17. Normaliser région
✅ 18. Filtrer > 1000
✅ 19-20. Colonnes booléennes
✅ 21. Détecter outliers (IQR)
✅ 22. Remplacer outliers
✅ 23. Mode paiement en catégorie
```

### **PART 3: AGRÉGATION (7 points)** ✅
```
✅ 24. Pivot montants/région/type
✅ 25. Pivot réservations/mois/type
✅ 26. Groupby client: somme
✅ 27. Groupby région: moyenne
✅ 28. Export CSV
✅ 29. Export Excel pivot tables
✅ 30. Visualisation finale
```

---

## 🔗 DÉPENDANCES & PRÉREQUIS

### **Packages Python**
```
pymongo==4.6.0      # MongoDB
pandas==2.1.3       # Data manipulation
numpy==1.24.3       # Calculs
matplotlib==3.8.2   # Visualisations
seaborn==0.13.0     # Visualisations avancées
openpyxl==3.11.0    # Export Excel
certifi==2025.x.x   # Certificats SSL
```

**Installation:**
```bash
pip install -r requirements.txt
```

**Ou sur Colab:**
```python
!pip install -q pymongo pandas numpy openpyxl matplotlib seaborn certifi
```

### **MongoDB Atlas**
- ✅ Cluster: `cluster0.v6scg.mongodb.net`
- ✅ Utilisateur: `Raef`
- ✅ Base: `gestion-hoteliere`
- ✅ Network Access: `0.0.0.0/0`

---

## 📋 CHECKLIST AVANT DÉMARRAGE

- ✅ Python 3.8+
- ✅ Packages installés
- ✅ MongoDB Atlas cluster ACTIVE
- ✅ Network Access autorisé
- ✅ Utilisateur Raef + password valide
- ✅ Connexion internet stable

---

## 📊 DONNÉES DISPONIBLES

### Collections MongoDB
```
✅ reservations: 200 documents
✅ chambres: 610 documents
✅ hotels: 20 documents
✅ users: 101 documents
✅ paiements: 114 documents
✅ factures: 142 documents
✅ services: 208 documents

TOTAL: 1295 documents
```

### Fichiers générés
```
✅ reservations_clean.csv
✅ chambres_clean.csv
✅ hotels_clean.csv
✅ users_clean.csv
✅ paiements_clean.csv
✅ factures_clean.csv
✅ services_clean.csv (optionnel)
✅ pivot_tables.xlsx
```

---

## 🎯 PARCOURS D'APPRENTISSAGE

### Jour 1: Setup & Exploration
1. Lire: **COLAB_COMPLETE_GUIDE.md** (5 min)
2. Tester: **test_atlas_connection.py** (2 min)
3. Exécuter: **etl_transformation.ipynb - PART 1** (10 min)

### Jour 2: Nettoyage
1. Exécuter: **etl_transformation.ipynb - PART 2** (15 min)
2. Analyser les transformations
3. Exporter les fichiers CSV

### Jour 3: Agrégation & Export
1. Exécuter: **etl_transformation.ipynb - PART 3** (10 min)
2. Télécharger les résultats
3. Vérifier les fichiers CSV

### Jour 4+: Data Warehouse
1. Charger les CSV dans PostgreSQL/MySQL
2. Créer modèle en étoile
3. Préparer pour Power BI

---

## 🐛 TROUBLESHOOTING

### Erreur: "SSL: TLSV1_ALERT_INTERNAL_ERROR"
**Solution**: Lire **COLAB_SSL_FIX.md**

### Erreur: "Authentication failed"
**Solution**: Lire **MONGODB_ATLAS_CONFIG.md**

### Package manquant
```bash
pip install -r requirements.txt
```

### Timeout
Augmenter les timeouts dans la configuration MongoDB

---

## 📞 SUPPORT

### Si problème:
1. Lire le guide correspondant (voir tableau ci-dessus)
2. Exécuter le script de diagnostic: `python test_atlas_connection.py` ou `python fix_ssl_tls.py`
3. Vérifier les logs
4. Redémarrer le kernel Jupyter/Colab

---

## 🏆 RÉSULTAT ATTENDU

### Après exécution réussie:
```
✅ 30/30 points du TP appliqués
✅ 1295 documents explorés
✅ Données nettoyées (0 doublons, 0 valeurs manquantes)
✅ 6 fichiers CSV générés
✅ Pivot tables créées
✅ Visualisations produites

Fichiers prêts pour:
- Data Warehouse (PostgreSQL/MySQL)
- Power BI (Dashboard)
- Intégration MERN
```

---

## 📈 Prochaines étapes

```
ETL (Vous êtes ici!) ✅
    ↓
Data Warehouse ⏳
    ↓
Power BI Dashboard ⏳
    ↓
MERN Integration ⏳
    ↓
Présentation 5 min ⏳
```

---

## 🌟 Points clés

| Point | Importance | Status |
|-------|-----------|--------|
| Connexion MongoDB Atlas | ⭐⭐⭐ | ✅ Testé |
| Extraction des données | ⭐⭐⭐ | ✅ Automatisé |
| Nettoyage ETL | ⭐⭐⭐ | ✅ Complet (30 pts) |
| Export CSV | ⭐⭐ | ✅ Prêt |
| Visualisations | ⭐⭐ | ✅ Inclus |
| Documentation | ⭐⭐ | ✅ Exhaustif |

---

## 📞 Besoin d'aide?

1. **Guide Colab**: Lire `COLAB_COMPLETE_GUIDE.md`
2. **Problème SSL**: Lire `COLAB_SSL_FIX.md`
3. **Problème connexion**: Lire `MONGODB_ATLAS_CONFIG.md`
4. **Questions ETL**: Lire `ETL_PROCESS.md`
5. **Test connexion**: `python test_atlas_connection.py`

---

**✨ Bon courage pour votre ETL! 🚀**

*Créé pour: Mini-projet BI 5ème année Informatique*
*Module: Data Analytics & Business Intelligence*
*Date: Janvier 2026*
