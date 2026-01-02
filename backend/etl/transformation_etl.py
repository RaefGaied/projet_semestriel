"""
TRANSFORMATION ETL - BI Mini-projet
Module: Data Analytics & Business Intelligence
Objectif: Nettoyage, transformation et préparation des données pour Data Warehouse

À exécuter sur Google Colab
Source: MongoDB Atlas
Sortie: Fichiers CSV nettoyés + Pivot tables
"""

import pandas as pd
import numpy as np
import pymongo
from pymongo import MongoClient
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================

MONGODB_ATLAS_URI = "mongodb+srv://Raef:YOUR_PASSWORD@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

# Chemin de sortie (adapter pour Colab: /content/drive/MyDrive/BI_Projet/)
OUTPUT_PATH = "./output_etl/"

import os
os.makedirs(OUTPUT_PATH, exist_ok=True)

print("=" * 80)
print("🔧 TRANSFORMATION ETL - NETTOYAGE DES DONNÉES")
print("=" * 80)

# ============================================================================
# ÉTAPE 1: EXTRACTION (CONNEXION MONGODB)
# ============================================================================

print("\n📍 ÉTAPE 1: EXTRACTION - Connexion MongoDB Atlas...")
try:
    client = MongoClient(MONGODB_ATLAS_URI)
    db = client[DATABASE_NAME]
    print(f"✅ Connecté à MongoDB Atlas")
except Exception as e:
    print(f"❌ Erreur: {e}")
    exit()

# Charger les données brutes
print("\n📥 Chargement des collections...")
reservations = pd.DataFrame(list(db['reservations'].find()))
paiements = pd.DataFrame(list(db['paiements'].find()))
factures = pd.DataFrame(list(db['factures'].find()))
chambres = pd.DataFrame(list(db['chambres'].find()))
hotels = pd.DataFrame(list(db['hotels'].find()))
users = pd.DataFrame(list(db['users'].find()))
services = pd.DataFrame(list(db['services'].find()))

print(f"✅ Réservations: {len(reservations)} lignes")
print(f"✅ Paiements: {len(paiements)} lignes")
print(f"✅ Factures: {len(factures)} lignes")
print(f"✅ Chambres: {len(chambres)} lignes")
print(f"✅ Hotels: {len(hotels)} lignes")
print(f"✅ Users: {len(users)} lignes")
print(f"✅ Services: {len(services)} lignes")

# ============================================================================
# ÉTAPE 2: TRANSFORMATION (NETTOYAGE ET NORMALISATION)
# ============================================================================

print("\n" + "=" * 80)
print("🔄 ÉTAPE 2: TRANSFORMATION - Nettoyage des données")
print("=" * 80)

# -------- RÉSERVATIONS --------
print(f"\n📊 NETTOYAGE: RÉSERVATIONS")
print(f"   AVANT: {len(reservations)} lignes")

# 1. Supprimer les réservations annulées
reservations = reservations[reservations['statut'] != 'annulée']
print(f"   ✅ Suppression réservations annulées: {len(reservations)} lignes")

# 2. Remplir les valeurs manquantes (montant)
if 'montant' in reservations.columns:
    reservations['montant'].fillna(reservations['montant'].median(), inplace=True)
    print(f"   ✅ Remplissage montant manquant")

# 3. Convertir les dates en datetime
date_columns = ['date_debut', 'date_fin', 'date_creation']
for col in date_columns:
    if col in reservations.columns:
        reservations[col] = pd.to_datetime(reservations[col], errors='coerce')
print(f"   ✅ Conversion dates en datetime")

# 4. Créer des colonnes dérivées
if 'montant' in reservations.columns:
    reservations['montant_abs'] = reservations['montant'].abs()
    print(f"   ✅ Colonne montant_abs créée")

if 'date_creation' in reservations.columns:
    reservations['annee_creation'] = reservations['date_creation'].dt.year
    reservations['mois_creation'] = reservations['date_creation'].dt.month
    reservations['jour_creation'] = reservations['date_creation'].dt.day
    print(f"   ✅ Colonnes temporelles créées (année, mois, jour)")

if 'date_debut' in reservations.columns:
    reservations['duree_sejour'] = (reservations['date_fin'] - reservations['date_debut']).dt.days
    print(f"   ✅ Colonne duree_sejour créée")

# 5. Détecter les outliers (IQR)
if 'montant' in reservations.columns:
    Q1 = reservations['montant'].quantile(0.25)
    Q3 = reservations['montant'].quantile(0.75)
    IQR = Q3 - Q1
    reservations['outlier'] = (reservations['montant'] < Q1 - 1.5*IQR) | (reservations['montant'] > Q3 + 1.5*IQR)
    outliers_count = reservations['outlier'].sum()
    print(f"   ✅ Détection outliers: {outliers_count} anomalies détectées")

# 6. Remplacer les outliers par la médiane
if 'montant' in reservations.columns and 'outlier' in reservations.columns:
    median_montant = reservations[~reservations['outlier']]['montant'].median()
    reservations.loc[reservations['outlier'], 'montant'] = median_montant
    print(f"   ✅ Remplacement outliers par médiane")

# 7. Ajouter statut de paiement (merger avec paiements)
reservations['statut_paiement'] = 'non_paye'
for idx, row in reservations.iterrows():
    if '_id' in row and 'reservation_id' in paiements.columns:
        if row['_id'] in paiements['reservation_id'].values:
            reservations.at[idx, 'statut_paiement'] = 'paye'
print(f"   ✅ Statut paiement ajouté")

# 8. Codification binaire
reservations['est_annulee'] = (reservations['statut'] == 'annulée').astype(int)
print(f"   ✅ Colonnes booléennes créées")

print(f"   APRÈS: {len(reservations)} lignes")

# -------- PAIEMENTS --------
print(f"\n📊 NETTOYAGE: PAIEMENTS")
print(f"   AVANT: {len(paiements)} lignes")

if len(paiements) > 0:
    # Convertir les dates
    if 'date_paiement' in paiements.columns:
        paiements['date_paiement'] = pd.to_datetime(paiements['date_paiement'], errors='coerce')
        paiements['annee'] = paiements['date_paiement'].dt.year
        paiements['mois'] = paiements['date_paiement'].dt.month
        print(f"   ✅ Dates converties")
    
    # Montants positifs
    if 'montant' in paiements.columns:
        paiements['montant'] = paiements['montant'].abs()
        paiements = paiements[paiements['montant'] > 0]
        print(f"   ✅ Montants négatifs corrigés")
    
    # Normaliser statut
    if 'statut' in paiements.columns:
        paiements['statut'] = paiements['statut'].str.upper()
        print(f"   ✅ Statut normalisé")
    
    print(f"   APRÈS: {len(paiements)} lignes")

# -------- FACTURES --------
print(f"\n📊 NETTOYAGE: FACTURES")
print(f"   AVANT: {len(factures)} lignes")

if len(factures) > 0:
    # Dates
    if 'date_facture' in factures.columns:
        factures['date_facture'] = pd.to_datetime(factures['date_facture'], errors='coerce')
        factures['annee'] = factures['date_facture'].dt.year
        factures['mois'] = factures['date_facture'].dt.month
        print(f"   ✅ Dates converties")
    
    # Montants
    if 'montant' in factures.columns:
        factures['montant'] = pd.to_numeric(factures['montant'], errors='coerce')
        factures = factures[factures['montant'] > 0]
        print(f"   ✅ Montants validés")
    
    print(f"   APRÈS: {len(factures)} lignes")

# -------- CHAMBRES --------
print(f"\n📊 NETTOYAGE: CHAMBRES")
print(f"   AVANT: {len(chambres)} lignes")

if len(chambres) > 0:
    # Normaliser types
    if 'type' in chambres.columns:
        chambres['type'] = chambres['type'].str.upper()
        print(f"   ✅ Type chambre normalisé")
    
    # Prix positifs
    if 'prix_par_nuit' in chambres.columns:
        chambres['prix_par_nuit'] = pd.to_numeric(chambres['prix_par_nuit'], errors='coerce')
        chambres = chambres[chambres['prix_par_nuit'] > 0]
        print(f"   ✅ Prix validés")
    
    print(f"   APRÈS: {len(chambres)} lignes")

# -------- HOTELS --------
print(f"\n📊 NETTOYAGE: HOTELS")
print(f"   AVANT: {len(hotels)} lignes")

if len(hotels) > 0:
    # Normaliser ville
    if 'ville' in hotels.columns:
        hotels['ville'] = hotels['ville'].str.upper()
        print(f"   ✅ Ville normalisée")
    
    print(f"   APRÈS: {len(hotels)} lignes")

# -------- USERS --------
print(f"\n📊 NETTOYAGE: USERS")
print(f"   AVANT: {len(users)} lignes")

if len(users) > 0:
    # Normaliser ville
    if 'ville' in users.columns:
        users['ville'] = users['ville'].str.upper()
        print(f"   ✅ Ville normalisée")
    
    # Email unique
    if 'email' in users.columns:
        users = users.drop_duplicates(subset=['email'])
        print(f"   ✅ Doublons email supprimés")
    
    print(f"   APRÈS: {len(users)} lignes")

# ============================================================================
# ÉTAPE 3: AGRÉGATIONS ET PIVOT TABLES
# ============================================================================

print("\n" + "=" * 80)
print("📊 ÉTAPE 3: AGRÉGATIONS ET PIVOT TABLES")
print("=" * 80)

# Pivot 1: Montant par type de chambre et année
if len(reservations) > 0 and 'montant' in reservations.columns and 'annee_creation' in reservations.columns:
    pivot_montant_type = reservations.groupby(['annee_creation'])['montant'].agg(['sum', 'mean', 'count'])
    print(f"\n✅ Pivot montant par année créé")
    print(pivot_montant_type)

# Pivot 2: Nombre de réservations par mois
if len(reservations) > 0 and 'mois_creation' in reservations.columns:
    pivot_reservations_mois = reservations.groupby('mois_creation').size()
    print(f"\n✅ Pivot réservations par mois créé")
    print(pivot_reservations_mois)

# Pivot 3: Montant par statut paiement
if len(reservations) > 0 and 'statut_paiement' in reservations.columns:
    pivot_paiement = reservations.groupby('statut_paiement')['montant'].agg(['sum', 'count', 'mean'])
    print(f"\n✅ Pivot montant par statut paiement créé")
    print(pivot_paiement)

# ============================================================================
# ÉTAPE 4: CHARGEMENT (EXPORT)
# ============================================================================

print("\n" + "=" * 80)
print("💾 ÉTAPE 4: CHARGEMENT - Export des fichiers nettoyés")
print("=" * 80)

# Export CSV
print(f"\n📁 Export CSV:")
reservations.to_csv(f"{OUTPUT_PATH}reservations_clean.csv", index=False)
print(f"   ✅ reservations_clean.csv ({len(reservations)} lignes)")

paiements.to_csv(f"{OUTPUT_PATH}paiements_clean.csv", index=False)
print(f"   ✅ paiements_clean.csv ({len(paiements)} lignes)")

factures.to_csv(f"{OUTPUT_PATH}factures_clean.csv", index=False)
print(f"   ✅ factures_clean.csv ({len(factures)} lignes)")

chambres.to_csv(f"{OUTPUT_PATH}chambres_clean.csv", index=False)
print(f"   ✅ chambres_clean.csv ({len(chambres)} lignes)")

hotels.to_csv(f"{OUTPUT_PATH}hotels_clean.csv", index=False)
print(f"   ✅ hotels_clean.csv ({len(hotels)} lignes)")

users.to_csv(f"{OUTPUT_PATH}users_clean.csv", index=False)
print(f"   ✅ users_clean.csv ({len(users)} lignes)")

# Export Pivot Tables
print(f"\n📊 Export Pivot Tables (Excel):")
with pd.ExcelWriter(f"{OUTPUT_PATH}pivot_tables.xlsx", engine='openpyxl') as writer:
    pivot_montant_type.to_excel(writer, sheet_name='Montant_Annee')
    pivot_reservations_mois.to_excel(writer, sheet_name='Reservations_Mois')
    pivot_paiement.to_excel(writer, sheet_name='Paiement_Status')
print(f"   ✅ pivot_tables.xlsx créé")

# ============================================================================
# RÉSUMÉ FINAL
# ============================================================================

print("\n" + "=" * 80)
print("✅ TRANSFORMATION ETL TERMINÉE")
print("=" * 80)

print(f"\n📋 RÉSUMÉ:")
print(f"\n📥 DONNÉES EXTRAITES:")
print(f"   Réservations: {len(reservations)} ✅")
print(f"   Paiements: {len(paiements)} ✅")
print(f"   Factures: {len(factures)} ✅")
print(f"   Chambres: {len(chambres)} ✅")
print(f"   Hotels: {len(hotels)} ✅")
print(f"   Users: {len(users)} ✅")

print(f"\n📁 FICHIERS GÉNÉRÉS:")
print(f"   Location: {OUTPUT_PATH}")
print(f"   - reservations_clean.csv")
print(f"   - paiements_clean.csv")
print(f"   - factures_clean.csv")
print(f"   - chambres_clean.csv")
print(f"   - hotels_clean.csv")
print(f"   - users_clean.csv")
print(f"   - pivot_tables.xlsx")

print(f"\n🔗 PROCHAINES ÉTAPES:")
print(f"   1. Télécharger les fichiers CSV/Excel")
print(f"   2. Charger dans PostgreSQL/MySQL Data Warehouse")
print(f"   3. Créer modèle en étoile (Fact + Dimensions)")
print(f"   4. Connecter Power BI au Data Warehouse")
print(f"   5. Créer dashboard BI interactif")

print(f"\n{'='*80}\n")

client.close()
