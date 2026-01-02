"""
NOTEBOOK GOOGLE COLAB - ETL BI Mini-projet
Copier-coller ce contenu dans une cellule Colab
"""

# ============================================================================
# SETUP INITIAL - À exécuter d'abord
# ============================================================================

# %pip install pymongo pandas numpy openpyxl

# ============================================================================
# CELL 1: CONFIGURATION ET IMPORTS
# ============================================================================

import pandas as pd
import numpy as np
import pymongo
from pymongo import MongoClient
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

print("✅ Imports terminés")

# ============================================================================
# CELL 2: CONNEXION MONGODB ATLAS
# ============================================================================

MONGODB_ATLAS_URI = "mongodb+srv://Raef:YOUR_PASSWORD@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

print("📍 Connexion à MongoDB Atlas...")
try:
    client = MongoClient(MONGODB_ATLAS_URI)
    db = client[DATABASE_NAME]
    
    # Test de connexion
    db.command('ping')
    print("✅ Connecté à MongoDB Atlas avec succès!")
    
    # Afficher les collections
    collections = db.list_collection_names()
    print(f"📊 Collections disponibles: {collections}")
    
except Exception as e:
    print(f"❌ Erreur: {e}")
    print("Vérifiez votre URI MongoDB Atlas et votre connexion réseau")

# ============================================================================
# CELL 3: EXTRACTION DES DONNÉES
# ============================================================================

print("\n📥 EXTRACTION DES DONNÉES...")

# Charger les collections
reservations = pd.DataFrame(list(db['reservations'].find()))
paiements = pd.DataFrame(list(db['paiements'].find())) 
factures = pd.DataFrame(list(db['factures'].find()))
chambres = pd.DataFrame(list(db['chambres'].find()))
hotels = pd.DataFrame(list(db['hotels'].find()))
users = pd.DataFrame(list(db['users'].find()))
services = pd.DataFrame(list(db['services'].find()))

print(f"✅ Réservations: {len(reservations)} documents")
print(f"✅ Paiements: {len(paiements)} documents")
print(f"✅ Factures: {len(factures)} documents")
print(f"✅ Chambres: {len(chambres)} documents")
print(f"✅ Hotels: {len(hotels)} documents")
print(f"✅ Users: {len(users)} documents")
print(f"✅ Services: {len(services)} documents")

# ============================================================================
# CELL 4: EXPLORATION RÉSERVATIONS (TP Part 1)
# ============================================================================

print("\n" + "="*80)
print("🔍 EXPLORATION RÉSERVATIONS")
print("="*80)

print("\n1️⃣ PREMIÈRES LIGNES:")
print(reservations.head(3))

print("\n2️⃣ INFORMATIONS GÉNÉRALES:")
print(f"Shape: {reservations.shape}")
print(f"Colonnes: {list(reservations.columns)}")
print(f"\nTypes de données:")
print(reservations.dtypes)

print("\n3️⃣ STATISTIQUES DESCRIPTIVES:")
print(reservations.describe())

print("\n4️⃣ VALEURS MANQUANTES:")
missing = reservations.isnull().sum()
print(missing[missing > 0] if missing.sum() > 0 else "✅ Aucune valeur manquante")

print("\n5️⃣ DOUBLONS:")
print(f"Nombre de doublons: {reservations.duplicated().sum()}")

print("\n6️⃣ DISTRIBUTION DES STATUTS:")
print(reservations['statut'].value_counts())

print("\n7️⃣ MONTANTS - STATISTIQUES:")
print(reservations['montant'].describe())

# ============================================================================
# CELL 5: NETTOYAGE RÉSERVATIONS (TP Part 2)
# ============================================================================

print("\n" + "="*80)
print("🧹 NETTOYAGE RÉSERVATIONS")
print("="*80)

print(f"\nAVANT: {len(reservations)} lignes")

# 11. Supprimer les annulées
reservations = reservations[reservations['statut'] != 'annulée']
print(f"✅ Après suppression annulées: {len(reservations)} lignes")

# 12. Remplir montants manquants
if 'montant' in reservations.columns:
    reservations['montant'].fillna(reservations['montant'].median(), inplace=True)
    print(f"✅ Montants manquants remplis par médiane")

# 13. Convertir dates
date_cols = ['date_debut', 'date_fin', 'date_creation']
for col in date_cols:
    if col in reservations.columns:
        reservations[col] = pd.to_datetime(reservations[col], errors='coerce')
print(f"✅ Dates converties en datetime")

# 14. Montant absolu
reservations['montant_abs'] = reservations['montant'].abs()
print(f"✅ Colonne montant_abs créée")

# 15-16. Extraire année/mois
if 'date_creation' in reservations.columns:
    reservations['annee'] = reservations['date_creation'].dt.year
    reservations['mois'] = reservations['date_creation'].dt.month
    print(f"✅ Colonnes année/mois créées")

# 17. Normaliser région (exemple avec 'ville')
if 'ville' in reservations.columns:
    reservations['ville'] = reservations['ville'].str.upper()
    print(f"✅ Région normalisée")

# 21. Détecter outliers (IQR)
Q1 = reservations['montant'].quantile(0.25)
Q3 = reservations['montant'].quantile(0.75)
IQR = Q3 - Q1
reservations['outlier'] = (reservations['montant'] < Q1 - 1.5*IQR) | (reservations['montant'] > Q3 + 1.5*IQR)
print(f"✅ Outliers détectés: {reservations['outlier'].sum()}")

# 22. Remplacer outliers par médiane
median_val = reservations[~reservations['outlier']]['montant'].median()
reservations.loc[reservations['outlier'], 'montant'] = median_val
print(f"✅ Outliers remplacés par médiane")

print(f"\nAPRÈS: {len(reservations)} lignes ✅")

# ============================================================================
# CELL 6: AGRÉGATIONS (TP Part 3)
# ============================================================================

print("\n" + "="*80)
print("📊 AGRÉGATIONS ET PIVOT TABLES")
print("="*80)

# 24. Pivot table montants par région et type
if 'ville' in reservations.columns and 'type' in reservations.columns:
    pivot_1 = pd.pivot_table(
        reservations, 
        values='montant', 
        index='ville', 
        columns='type',
        aggfunc='sum'
    )
    print("\n✅ Pivot Table: Montants par ville et type")
    print(pivot_1)

# 25. Pivot table réservations par mois
if 'mois' in reservations.columns and 'type' in reservations.columns:
    pivot_2 = pd.pivot_table(
        reservations,
        values='montant',
        index='mois',
        columns='type',
        aggfunc='count'
    )
    print("\n✅ Pivot Table: Nombre réservations par mois et type")
    print(pivot_2)

# 26. Groupby client
if 'client_id' in reservations.columns:
    group_client = reservations.groupby('client_id')['montant'].sum().sort_values(ascending=False)
    print("\n✅ Top 10 clients par montant total:")
    print(group_client.head(10))

# 27. Groupby région et calcul moyennes
if 'ville' in reservations.columns and 'type' in reservations.columns:
    group_region = reservations.groupby('ville')['montant'].agg(['mean', 'sum', 'count'])
    print("\n✅ Statistiques par région:")
    print(group_region)

# ============================================================================
# CELL 7: EXPORT DES FICHIERS
# ============================================================================

print("\n" + "="*80)
print("💾 EXPORT DES FICHIERS NETTOYÉS")
print("="*80)

# 28. Export CSV
reservations.to_csv('reservations_clean.csv', index=False)
print("✅ reservations_clean.csv exporté")

paiements.to_csv('paiements_clean.csv', index=False)
print("✅ paiements_clean.csv exporté")

factures.to_csv('factures_clean.csv', index=False)
print("✅ factures_clean.csv exporté")

chambres.to_csv('chambres_clean.csv', index=False)
print("✅ chambres_clean.csv exporté")

hotels.to_csv('hotels_clean.csv', index=False)
print("✅ hotels_clean.csv exporté")

users.to_csv('users_clean.csv', index=False)
print("✅ users_clean.csv exporté")

# 29. Exporter pivot tables Excel
with pd.ExcelWriter('pivot_tables.xlsx', engine='openpyxl') as writer:
    if 'pivot_1' in locals():
        pivot_1.to_excel(writer, sheet_name='Montant_Ville_Type')
    if 'pivot_2' in locals():
        pivot_2.to_excel(writer, sheet_name='Reservations_Mois_Type')
    if 'group_region' in locals():
        group_region.to_excel(writer, sheet_name='Statistiques_Region')
        
print("✅ pivot_tables.xlsx exporté")

# ============================================================================
# CELL 8: RÉSUMÉ FINAL
# ============================================================================

print("\n" + "="*80)
print("✅ TRANSFORMATION ETL TERMINÉE")
print("="*80)

print("\n📋 RÉSUMÉ DES TRANSFORMATIONS:")
print(f"✅ Réservations nettoyées: {len(reservations)} lignes")
print(f"✅ Paiements: {len(paiements)} lignes")
print(f"✅ Factures: {len(factures)} lignes")
print(f"✅ Chambres: {len(chambres)} lignes")
print(f"✅ Hotels: {len(hotels)} lignes")
print(f"✅ Users: {len(users)} lignes")

print("\n📁 FICHIERS À TÉLÉCHARGER:")
print("   - reservations_clean.csv")
print("   - paiements_clean.csv")
print("   - factures_clean.csv")
print("   - chambres_clean.csv")
print("   - hotels_clean.csv")
print("   - users_clean.csv")
print("   - pivot_tables.xlsx")

print("\n🔄 PROCHAINE ÉTAPE:")
print("   1. Télécharger les fichiers CSV")
print("   2. Charger dans PostgreSQL/MySQL")
print("   3. Créer le modèle en étoile (Fact + Dimensions)")
print("   4. Créer dashboard Power BI")
print("\n" + "="*80 + "\n")

client.close()
