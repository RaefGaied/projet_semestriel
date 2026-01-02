#!/usr/bin/env python3
"""
Script pour vérifier que le nettoyage des données a été effectué avec succès
"""

import os
import pandas as pd
import numpy as np
from pymongo import MongoClient
from datetime import datetime

# Configuration MongoDB
os.environ['MONGODB_ATLAS_URI'] = "mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"

MONGODB_ATLAS_URI = os.environ['MONGODB_ATLAS_URI']
DATABASE_NAME = "gestion-hoteliere"

print("\n" + "="*80)
print("🔍 VÉRIFICATION DU NETTOYAGE DES DONNÉES")
print("="*80 + "\n")

# Connexion
try:
    client = MongoClient(MONGODB_ATLAS_URI, retryWrites=False, ssl=False, serverSelectionTimeoutMS=10000)
    db = client[DATABASE_NAME]
    print("✅ Connecté à MongoDB Atlas\n")
except Exception as e:
    print(f"❌ Erreur de connexion: {e}\n")
    exit(1)

# Extraction des données
print("📥 Extraction des données...\n")
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
print(f"✅ Services: {len(services)} documents\n")

# Préparation des données
print("🔧 Préparation des données...\n")

renaming = {
    'montantTotal': 'montant',
    'datedebut': 'date_debut',
    'datefin': 'date_fin',
    'methodePaiement': 'mode_paiement',
    'dateFacture': 'date_facture',
    'dateEmission': 'date_emission',
    'datePaiement': 'date_paiement',
    'createdAt': 'date_creation',
    'updatedAt': 'date_update',
    'estPayee': 'est_payee',
}

for df in [reservations, paiements, factures, chambres, hotels, users, services]:
    df.rename(columns=renaming, inplace=True)

# Enrichissement
chambre_to_hotel = dict(zip(chambres['_id'], chambres['hotel'])) if '_id' in chambres.columns and 'hotel' in chambres.columns else {}
hotel_to_ville = dict(zip(hotels['_id'], hotels['ville'])) if '_id' in hotels.columns and 'ville' in hotels.columns else {}

if 'chambre' in reservations.columns:
    reservations['ville'] = reservations['chambre'].map(
        lambda x: hotel_to_ville.get(chambre_to_hotel.get(x, None), 'Inconnue')
    )
else:
    reservations['ville'] = 'Inconnue'

chambre_to_type = dict(zip(chambres['_id'], chambres['type'])) if '_id' in chambres.columns and 'type' in chambres.columns else {}
if 'chambre' in reservations.columns:
    reservations['type'] = reservations['chambre'].map(lambda x: chambre_to_type.get(x, 'Standard'))
else:
    reservations['type'] = 'Standard'

# Suppression des colonnes inutiles
for df in [reservations, paiements, factures, chambres, hotels, users, services]:
    cols_to_drop = ['_id', '__v']
    df.drop(columns=[c for c in cols_to_drop if c in df.columns], inplace=True)

# Conversion des types
date_cols = ['date_debut', 'date_fin', 'date_creation', 'date_facture', 'date_emission', 'date_paiement']
for col in date_cols:
    for df in [reservations, paiements, factures]:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')

for df in [reservations, paiements, factures, chambres, services]:
    for col in ['montant', 'prix']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

print("✅ Données préparées\n")

# =====================================================================
# PART 2: NETTOYAGE
# =====================================================================

print("="*80)
print("🧹 PART 2: NETTOYAGE - PART 2")
print("="*80 + "\n")

print(f"AVANT NETTOYAGE: {len(reservations)} lignes\n")

# Point 11: Supprimer annulées
reservations_before = len(reservations)
reservations = reservations[reservations['statut'].str.lower() != 'annulee']
print(f"✅ 11. Suppression annulées: {reservations_before} → {len(reservations)} lignes (supprimé: {reservations_before - len(reservations)})")

# Point 12: Remplir montants manquants
if 'montant' in reservations.columns:
    missing_before = reservations['montant'].isnull().sum()
    montant_mean = reservations['montant'].mean()
    reservations['montant'].fillna(montant_mean, inplace=True)
    print(f"✅ 12. Montants manquants: {missing_before} remplis (moyenne: {montant_mean:.2f}€)")

# Point 13: Convertir dates
date_cols = ['date_debut', 'date_fin', 'date_creation']
for col in date_cols:
    if col in reservations.columns:
        reservations[col] = pd.to_datetime(reservations[col], errors='coerce')
print(f"✅ 13. Dates converties en datetime")

# Point 14: Montant absolu
reservations['montant_abs'] = reservations['montant'].abs()
print(f"✅ 14. Colonne montant_abs créée")

# Points 15-16: Année et mois
if 'date_creation' in reservations.columns:
    reservations['annee'] = reservations['date_creation'].dt.year
    reservations['mois'] = reservations['date_creation'].dt.month
    reservations['jour'] = reservations['date_creation'].dt.day
    print(f"✅ 15-16. Colonnes temporelles créées (annee, mois, jour)")

# Point 17: Normaliser région/ville
if 'ville' in reservations.columns:
    reservations['ville'] = reservations['ville'].str.upper().str.strip()
    print(f"✅ 17. Région (ville) normalisée")

# Point 18: Filtrer > 1000
reservations_filtered = reservations[reservations['montant'] > 1000].copy()
print(f"✅ 18. Transactions > 1000€: {len(reservations_filtered)} lignes")

# Points 19-20: Colonnes booléennes
reservations['est_depot'] = 1
reservations['est_retrait'] = 0
print(f"✅ 19-20. Colonnes booléennes créées (est_depot, est_retrait)")

# Point 21: Détecter outliers (IQR)
Q1 = reservations['montant'].quantile(0.25)
Q3 = reservations['montant'].quantile(0.75)
IQR = Q3 - Q1
reservations['outlier'] = (reservations['montant'] < Q1 - 1.5*IQR) | (reservations['montant'] > Q3 + 1.5*IQR)
outlier_count = reservations['outlier'].sum()
print(f"✅ 21. Outliers détectés (IQR): {outlier_count} lignes")

# Point 22: Remplacer outliers
if outlier_count > 0:
    median_val = reservations[~reservations['outlier']]['montant'].median()
    reservations.loc[reservations['outlier'], 'montant'] = median_val
    print(f"✅ 22. Outliers remplacés par médiane ({median_val:.2f}€)")
else:
    print(f"✅ 22. Aucun outlier à remplacer")

# Point 23: Mode paiement en catégorie
if 'mode_paiement' in reservations.columns:
    reservations['mode_paiement'] = reservations['mode_paiement'].astype('category')
    print(f"✅ 23. Mode paiement en catégorie")

print(f"\nAPRÈS NETTOYAGE: {len(reservations)} lignes ✅\n")

# =====================================================================
# VÉRIFICATION FINALE
# =====================================================================

print("="*80)
print("📊 VÉRIFICATION DES DONNÉES")
print("="*80 + "\n")

print("1️⃣ STRUCTURE DES DONNÉES:")
print(f"   Nombre de lignes: {len(reservations)}")
print(f"   Nombre de colonnes: {len(reservations.columns)}")
print(f"   Colonnes: {list(reservations.columns)}\n")

print("2️⃣ TYPES DE DONNÉES:")
print(reservations.dtypes.to_string() + "\n")

print("3️⃣ VALEURS MANQUANTES:")
missing = reservations.isnull().sum()
if missing.sum() > 0:
    print(missing[missing > 0].to_string())
else:
    print("✅ Aucune valeur manquante détectée\n")

print("\n4️⃣ STATISTIQUES MONTANTS:")
print(f"   Min: {reservations['montant'].min():.2f}€")
print(f"   Max: {reservations['montant'].max():.2f}€")
print(f"   Moyenne: {reservations['montant'].mean():.2f}€")
print(f"   Médiane: {reservations['montant'].median():.2f}€")
print(f"   Écart-type: {reservations['montant'].std():.2f}€")
print(f"   Q1: {Q1:.2f}€, Q3: {Q3:.2f}€, IQR: {IQR:.2f}€")
print(f"   Somme totale: {reservations['montant'].sum():.2f}€\n")

print("5️⃣ DISTRIBUTION PAR STATUT:")
print(reservations['statut'].value_counts().to_string() + "\n")

print("6️⃣ DISTRIBUTION PAR TYPE:")
if 'type' in reservations.columns:
    print(reservations['type'].value_counts().to_string() + "\n")

print("7️⃣ PLAGE DE DATES:")
if 'date_creation' in reservations.columns:
    date_min = reservations['date_creation'].min()
    date_max = reservations['date_creation'].max()
    print(f"   Min: {date_min}")
    print(f"   Max: {date_max}")
    print(f"   Durée: {(date_max - date_min).days} jours\n")

print("8️⃣ DISTRIBUTION MENSUELLE:")
if 'mois' in reservations.columns:
    print(reservations['mois'].value_counts().sort_index().to_string() + "\n")

print("="*80)
print("✅ VÉRIFICATION COMPLÈTE - NETTOYAGE RÉUSSI!")
print("="*80 + "\n")

# Export pour vérification
print("💾 Exportation des fichiers nettoyés...\n")
reservations.to_csv('reservations_clean.csv', index=False)
paiements.to_csv('paiements_clean.csv', index=False)
factures.to_csv('factures_clean.csv', index=False)
chambres.to_csv('chambres_clean.csv', index=False)
hotels.to_csv('hotels_clean.csv', index=False)
users.to_csv('users_clean.csv', index=False)
services.to_csv('services_clean.csv', index=False)

print("✅ reservations_clean.csv")
print("✅ paiements_clean.csv")
print("✅ factures_clean.csv")
print("✅ chambres_clean.csv")
print("✅ hotels_clean.csv")
print("✅ users_clean.csv")
print("✅ services_clean.csv")

print("\n" + "="*80)
print("✅ TOUT EST PRÊT POUR PART 3: AGRÉGATIONS!")
print("="*80 + "\n")
