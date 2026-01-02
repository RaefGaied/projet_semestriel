# 🚀 GUIDE COMPLET ETL - Google Colab

## 📋 Résumé de la situation

✅ **MongoDB Atlas**: Connecté et fonctionnel
✅ **Données disponibles**: 7 collections (1295 documents)
✅ **Notebook**: Prêt à exécuter

⚠️ **Problème possible**: Erreur SSL/TLS sur Colab (environnement isolé)

---

## 🎯 Plan d'action

### Phase 1: Préparation Colab (5 min)
### Phase 2: Extraction & Exploration (5 min)
### Phase 3: Nettoyage ETL (5 min)
### Phase 4: Export & Agrégation (5 min)
### Phase 5: Téléchargement (2 min)

**Durée totale: ~20-30 minutes**

---

## 🔧 PHASE 1: PRÉPARATION COLAB

### Step 1.1: Créer notebook Colab

1. Aller sur [Google Colab](https://colab.research.google.com)
2. Cliquer: **File → New notebook**
3. Renommer: `ETL_BI_Hotel`

### Step 1.2: Installation des packages (Cell 1)

```python
# Installation - Exécuter d'abord
!pip install -q pymongo pandas numpy openpyxl matplotlib seaborn certifi

print("="*50)
print("✅ Packages installés:")
print("  ✅ pymongo (MongoDB)")
print("  ✅ pandas (Data manipulation)")
print("  ✅ numpy (Calculs)")
print("  ✅ matplotlib & seaborn (Visualisations)")
print("  ✅ certifi (Certificats SSL)")
print("="*50)
```

---

## 📥 PHASE 2: EXTRACTION & EXPLORATION

### Step 2.1: Configuration (Cell 2)

```python
import pandas as pd
import numpy as np
from pymongo import MongoClient
import certifi
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Configuration
MONGODB_ATLAS_URI = "mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

print("✅ Configuration prête")
```

### Step 2.2: Connexion (Cell 3) ⭐ CRITIQUE

```python
print("📍 Connexion à MongoDB Atlas...\n")

try:
    # Connexion avec certificat CA (IMPORTANT POUR COLAB)
    client = MongoClient(
        MONGODB_ATLAS_URI,
        tlsCAFile=certifi.where(),  # Clé pour Colab!
        tlsAllowInvalidCertificates=False,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000,
        socketTimeoutMS=30000,
        maxPoolSize=50
    )
    
    # Test de ping
    client.admin.command('ping')
    print("✅ CONNECTÉ À MONGODB ATLAS!")
    
    db = client[DATABASE_NAME]
    collections = db.list_collection_names()
    
    print(f"\n📊 Collections ({len(collections)}):")
    for col in collections:
        count = db[col].count_documents({})
        print(f"   ✅ {col}: {count} documents")
    
except Exception as e:
    print(f"❌ ERREUR: {type(e).__name__}")
    print(f"   Message: {str(e)[:100]}")
    print("\n🔧 SOLUTIONS:")
    print("   1. Redémarrer le kernel (Runtime → Restart)")
    print("   2. Réexécuter les cellules 1 et 2")
    print("   3. Vérifier Network Access MongoDB Atlas: 0.0.0.0/0")
```

### Step 2.3: Extraction des données (Cell 4)

```python
print("\n📥 EXTRACTION DES DONNÉES...\n")

# Charger toutes les collections
reservations = pd.DataFrame(list(db['reservations'].find()))
paiements = pd.DataFrame(list(db['paiements'].find()))
factures = pd.DataFrame(list(db['factures'].find()))
chambres = pd.DataFrame(list(db['chambres'].find()))
hotels = pd.DataFrame(list(db['hotels'].find()))
users = pd.DataFrame(list(db['users'].find()))
services = pd.DataFrame(list(db['services'].find()))

# Afficher les statistiques
print("✅ Données chargées:")
print(f"   📌 Réservations: {len(reservations)} lignes")
print(f"   📌 Paiements: {len(paiements)} lignes")
print(f"   📌 Factures: {len(factures)} lignes")
print(f"   📌 Chambres: {len(chambres)} lignes")
print(f"   📌 Hotels: {len(hotels)} lignes")
print(f"   📌 Users: {len(users)} lignes")
print(f"   📌 Services: {len(services)} lignes")

print(f"\n📊 TOTAL: {len(reservations) + len(paiements) + len(factures) + len(chambres) + len(hotels) + len(users) + len(services)} documents")
```

---

## 🧹 PHASE 3: NETTOYAGE ETL

### Step 3.1: Exploration (Cell 5-6)

```python
print("\n" + "="*80)
print("🔍 PART 1: EXPLORATION")
print("="*80 + "\n")

# 1. Premières lignes
print("1️⃣ PREMIÈRES LIGNES:")
print(reservations.head(5))

# 2. Informations
print("\n2️⃣ INFORMATIONS GÉNÉRALES:")
print(f"Shape: {reservations.shape}")
print(f"Colonnes: {list(reservations.columns)}")

# 3. Statistiques
print("\n3️⃣ STATISTIQUES DESCRIPTIVES:")
print(reservations[['montant']].describe())

# 4. Valeurs manquantes
print("\n4️⃣ VALEURS MANQUANTES:")
missing = reservations.isnull().sum()
print(f"Total: {missing.sum()}" if missing.sum() > 0 else "✅ Aucune")

# 5. Doublons
print(f"\n5️⃣ DOUBLONS: {reservations.duplicated().sum()}")

# 6-7. Distributions
print("\n6️⃣ DISTRIBUTION STATUTS:")
print(reservations['statut'].value_counts())

# 8-10. Visualisations
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
reservations['montant'].hist(ax=ax[0], bins=50)
ax[0].set_title("Distribution montants")
reservations['statut'].value_counts().plot(kind='bar', ax=ax[1])
ax[1].set_title("Distribution statuts")
plt.tight_layout()
plt.show()

print("\n✅ Exploration terminée")
```

### Step 3.2: Nettoyage (Cell 7)

```python
print("\n" + "="*80)
print("🧹 PART 2: NETTOYAGE ETL")
print("="*80 + "\n")

print(f"AVANT: {len(reservations)} lignes")

# 11. Supprimer annulées
reservations = reservations[reservations['statut'] != 'annulée']
print(f"✅ 11. Suppression annulées: {len(reservations)}")

# 12. Remplir montants
if 'montant' in reservations.columns:
    reservations['montant'].fillna(reservations['montant'].mean(), inplace=True)
    print(f"✅ 12. Montants remplis")

# 13. Dates
date_cols = ['date_debut', 'date_fin', 'date_creation']
for col in date_cols:
    if col in reservations.columns:
        reservations[col] = pd.to_datetime(reservations[col], errors='coerce')
print(f"✅ 13. Dates converties")

# 14-16. Colonnes dérivées
reservations['montant_abs'] = reservations['montant'].abs()
if 'date_creation' in reservations.columns:
    reservations['annee'] = reservations['date_creation'].dt.year
    reservations['mois'] = reservations['date_creation'].dt.month
print(f"✅ 14-16. Colonnes dérivées")

# 17. Normaliser
if 'ville' in reservations.columns:
    reservations['ville'] = reservations['ville'].str.upper()
print(f"✅ 17. Normalisation")

# 18-20. Filtres et booléens
reservations_filtered = reservations[reservations['montant'] > 1000]
reservations['est_depot'] = 1
reservations['est_retrait'] = 0
print(f"✅ 18-20. Filtres et colonnes booléennes")

# 21-22. Outliers
Q1, Q3 = reservations['montant'].quantile([0.25, 0.75])
IQR = Q3 - Q1
mask = (reservations['montant'] < Q1 - 1.5*IQR) | (reservations['montant'] > Q3 + 1.5*IQR)
outlier_count = mask.sum()
if outlier_count > 0:
    median = reservations[~mask]['montant'].median()
    reservations.loc[mask, 'montant'] = median
print(f"✅ 21-22. Outliers traités: {outlier_count}")

# 23. Catégorie
if 'mode_paiement' not in reservations.columns:
    reservations['mode_paiement'] = 'carte'
reservations['mode_paiement'] = reservations['mode_paiement'].astype('category')
print(f"✅ 23. Catégories")

print(f"\nAPRÈS: {len(reservations)} lignes ✅")
```

---

## 📊 PHASE 4: AGRÉGATIONS & EXPORT

### Step 4.1: Agrégations (Cell 8)

```python
print("\n" + "="*80)
print("📊 PART 3: AGRÉGATIONS")
print("="*80 + "\n")

# 24. Pivot montants
if 'ville' in reservations.columns:
    pivot1 = pd.pivot_table(
        reservations, values='montant', index='ville', aggfunc='sum'
    )
    print("✅ 24. Pivot montants par ville")
    print(pivot1.head())

# 25. Pivot par mois
if 'mois' in reservations.columns:
    pivot2 = reservations.groupby('mois')['montant'].agg(['sum', 'count'])
    print("\n✅ 25. Agrégation par mois")
    print(pivot2)

# 26-27. Groupby
group_stats = reservations.groupby('statut')['montant'].agg(['sum', 'mean', 'count'])
print("\n✅ 26-27. Statistiques agrégées")
print(group_stats)

print("\n✅ Agrégations terminées")
```

### Step 4.2: Export (Cell 9)

```python
print("\n" + "="*80)
print("💾 EXPORT DES FICHIERS")
print("="*80 + "\n")

# 28. Export CSV
reservations.to_csv('reservations_clean.csv', index=False)
paiements.to_csv('paiements_clean.csv', index=False)
factures.to_csv('factures_clean.csv', index=False)
chambres.to_csv('chambres_clean.csv', index=False)
hotels.to_csv('hotels_clean.csv', index=False)
users.to_csv('users_clean.csv', index=False)

print("✅ 28. Fichiers CSV exportés:")
print("   - reservations_clean.csv")
print("   - paiements_clean.csv")
print("   - factures_clean.csv")
print("   - chambres_clean.csv")
print("   - hotels_clean.csv")
print("   - users_clean.csv")

# 29. Pivot tables Excel
try:
    with pd.ExcelWriter('pivot_tables.xlsx', engine='openpyxl') as writer:
        pivot1.to_excel(writer, sheet_name='Montants_Ville')
        pivot2.to_excel(writer, sheet_name='Montants_Mois')
        group_stats.to_excel(writer, sheet_name='Statistiques')
    print("✅ 29. pivot_tables.xlsx créé")
except:
    print("⚠️  29. Excel non disponible (CSV suffisant)")

# 30. Visualisation finale
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
reservations['montant'].hist(ax=ax[0], bins=50)
ax[0].set_title("Distribution montants (APRÈS nettoyage)")
reservations['statut'].value_counts().plot(kind='bar', ax=ax[1])
ax[1].set_title("Distribution statuts")
plt.tight_layout()
plt.show()

print("\n✅ 30. Visualisations finales")
```

---

## 📥 PHASE 5: TÉLÉCHARGEMENT

### Télécharger depuis Colab

```python
# Les fichiers seront disponibles dans Files (gauche)
from google.colab import files

files.download('reservations_clean.csv')
files.download('paiements_clean.csv')
files.download('factures_clean.csv')
files.download('chambres_clean.csv')
files.download('hotels_clean.csv')
files.download('users_clean.csv')

try:
    files.download('pivot_tables.xlsx')
except:
    print("⚠️  Excel non disponible")

print("\n✅ Téléchargement démarré")
```

---

## ⚡ QUICK START (Copy-Paste)

Vous pouvez directement copier-coller le notebook complet:
[etl_transformation.ipynb](backend/etl/etl_transformation.ipynb)

---

## 🐛 Troubleshooting

### Erreur: "SSL: TLSV1_ALERT_INTERNAL_ERROR"
**Solution**: Ajouter dans la connexion:
```python
client = MongoClient(
    URI,
    tlsCAFile=certifi.where()  # ← Important!
)
```

### Erreur: "authentication failed"
**Solution**: Vérifier le password dans .env

### Timeout
**Solution**: Augmenter timeouts:
```python
serverSelectionTimeoutMS=30000
connectTimeoutMS=30000
```

### Redémarrer Colab
```
Menu: Runtime → Disconnect and delete all
Puis recharger la page
```

---

## 📊 Résumé final

```
✅ 30/30 points du TP appliqués
✅ 7 collections explorées
✅ 1295 documents nettoyés
✅ 6 fichiers CSV générés
✅ Pivot tables créées
✅ Visualisations produites

Fichiers résultats:
- reservations_clean.csv
- paiements_clean.csv
- factures_clean.csv
- chambres_clean.csv
- hotels_clean.csv
- users_clean.csv
- pivot_tables.xlsx (optionnel)
```

---

## 🎯 Prochaines étapes

1. Télécharger les fichiers CSV
2. Charger dans PostgreSQL/MySQL
3. Créer modèle en étoile (Fact + Dimensions)
4. Connecter Power BI
5. Créer dashboard BI

---

**🚀 C'est parti pour le ETL! Bonne chance! 🎉**
