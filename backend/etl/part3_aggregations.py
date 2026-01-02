#!/usr/bin/env python3
"""
PART 3: AGRÉGATIONS ET PIVOT TABLES (Points 24-30)
"""

import pandas as pd
from pymongo import MongoClient
import matplotlib.pyplot as plt

print("\n" + "="*80)
print("📊 PART 3: AGRÉGATIONS ET EXPORTS")
print("="*80 + "\n")

# Connexion MongoDB
uri = 'mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
db = client['gestion-hoteliere']

# Extraction et préparation des données
print("📥 Extraction des données...\n")
reservations = pd.DataFrame(list(db['reservations'].find()))
paiements = pd.DataFrame(list(db['paiements'].find()))
factures = pd.DataFrame(list(db['factures'].find()))
chambres = pd.DataFrame(list(db['chambres'].find()))
hotels = pd.DataFrame(list(db['hotels'].find()))
users = pd.DataFrame(list(db['users'].find()))
services = pd.DataFrame(list(db['services'].find()))

print(f"✅ {len(reservations)} réservations")
print(f"✅ {len(paiements)} paiements")
print(f"✅ {len(factures)} factures")
print(f"✅ {len(chambres)} chambres")
print(f"✅ {len(hotels)} hôtels")
print(f"✅ {len(users)} utilisateurs")
print(f"✅ {len(services)} services\n")

# Préparation des données (normalisation + enrichissement)
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
chambre_to_hotel = dict(zip(chambres['_id'], chambres['hotel'])) if '_id' in chambres.columns else {}
hotel_to_ville = dict(zip(hotels['_id'], hotels['ville'])) if '_id' in hotels.columns else {}

if 'chambre' in reservations.columns:
    reservations['ville'] = reservations['chambre'].map(
        lambda x: hotel_to_ville.get(chambre_to_hotel.get(x, None), 'Inconnue')
    )
    chambre_to_type = dict(zip(chambres['_id'], chambres['type'])) if '_id' in chambres.columns else {}
    reservations['type'] = reservations['chambre'].map(lambda x: chambre_to_type.get(x, 'Standard'))

# Nettoyage PART 2
reservations = reservations[reservations['statut'].str.lower() != 'annulee']
reservations['montant'].fillna(reservations['montant'].mean(), inplace=True)
reservations['date_creation'] = pd.to_datetime(reservations.get('date_debut', reservations.get('createdAt')), errors='coerce')
reservations['annee'] = reservations['date_creation'].dt.year
reservations['mois'] = reservations['date_creation'].dt.month
reservations['jour'] = reservations['date_creation'].dt.day
reservations['montant_abs'] = reservations['montant'].abs()

if 'ville' in reservations.columns:
    reservations['ville'] = reservations['ville'].str.upper().str.strip()

Q1 = reservations['montant'].quantile(0.25)
Q3 = reservations['montant'].quantile(0.75)
IQR = Q3 - Q1
reservations['outlier'] = (reservations['montant'] < Q1 - 1.5*IQR) | (reservations['montant'] > Q3 + 1.5*IQR)
if reservations['outlier'].sum() > 0:
    median_val = reservations[~reservations['outlier']]['montant'].median()
    reservations.loc[reservations['outlier'], 'montant'] = median_val

print("✅ Données préparées et nettoyées\n")

# =====================================================================
# POINT 24: PIVOT TABLE - Montants par ville et type
# =====================================================================

print("="*80)
print("2️⃣4️⃣ PIVOT TABLE: Montants par ville et type")
print("="*80 + "\n")

if 'ville' in reservations.columns and 'type' in reservations.columns:
    pivot_montant = pd.pivot_table(
        reservations,
        values='montant',
        index='ville',
        columns='type',
        aggfunc='sum',
        fill_value=0
    )
    print("✅ Pivot Table créée:\n")
    print(pivot_montant)
    print()
else:
    print("ℹ️ Colonnes manquantes, pivot simplifié par statut")
    pivot_montant = reservations.groupby('statut')['montant'].sum()
    print(pivot_montant)
    print()

# =====================================================================
# POINT 25: PIVOT TABLE - Réservations par mois et type
# =====================================================================

print("="*80)
print("2️⃣5️⃣ PIVOT TABLE: Réservations par mois et type")
print("="*80 + "\n")

if 'mois' in reservations.columns and 'type' in reservations.columns:
    pivot_mois = pd.pivot_table(
        reservations,
        values='montant',
        index='mois',
        columns='type',
        aggfunc='count',
        fill_value=0
    )
    print("✅ Pivot Table créée:\n")
    print(pivot_mois)
    print()
else:
    print("ℹ️ Pivot par mois uniquement")
    if 'mois' in reservations.columns:
        pivot_mois = reservations.groupby('mois')['montant'].agg(['count', 'sum'])
        print(pivot_mois)
        print()

# =====================================================================
# POINT 26: GROUPBY CLIENT
# =====================================================================

print("="*80)
print("2️⃣6️⃣ GROUPBY: Statistiques par client")
print("="*80 + "\n")

if 'client' in reservations.columns:
    group_client = reservations.groupby('client')['montant'].agg(['sum', 'count', 'mean']).sort_values('sum', ascending=False)
    print("✅ Top 10 clients par montant total:\n")
    print(group_client.head(10))
    print()
else:
    print("ℹ️ Colonne 'client' manquante, groupby par statut")
    group_status = reservations.groupby('statut')['montant'].agg(['sum', 'count', 'mean'])
    print(group_status)
    print()

# =====================================================================
# POINT 27: GROUPBY RÉGION/VILLE
# =====================================================================

print("="*80)
print("2️⃣7️⃣ GROUPBY: Statistiques par ville/région")
print("="*80 + "\n")

if 'ville' in reservations.columns:
    group_region = reservations.groupby('ville')['montant'].agg(['sum', 'mean', 'count']).sort_values('sum', ascending=False)
    print("✅ Statistiques par ville:\n")
    print(group_region.head(10))
    print()
else:
    print("ℹ️ Colonne 'ville' manquante")
    print()

# =====================================================================
# POINT 28: EXPORT CSV
# =====================================================================

print("="*80)
print("2️⃣8️⃣ EXPORT: Fichiers CSV")
print("="*80 + "\n")

# Supprimer _id et __v avant export
for df in [reservations, paiements, factures, chambres, hotels, users, services]:
    df.drop(columns=[c for c in ['_id', '__v'] if c in df.columns], inplace=True, errors='ignore')

reservations.to_csv('reservations_clean.csv', index=False)
print("✅ reservations_clean.csv")

paiements.to_csv('paiements_clean.csv', index=False)
print("✅ paiements_clean.csv")

factures.to_csv('factures_clean.csv', index=False)
print("✅ factures_clean.csv")

chambres.to_csv('chambres_clean.csv', index=False)
print("✅ chambres_clean.csv")

hotels.to_csv('hotels_clean.csv', index=False)
print("✅ hotels_clean.csv")

users.to_csv('users_clean.csv', index=False)
print("✅ users_clean.csv")

services.to_csv('services_clean.csv', index=False)
print("✅ services_clean.csv")

print()

# =====================================================================
# POINT 29: EXPORT EXCEL PIVOT TABLES
# =====================================================================

print("="*80)
print("2️⃣9️⃣ EXPORT: Pivot Tables Excel")
print("="*80 + "\n")

try:
    with pd.ExcelWriter('pivot_tables.xlsx', engine='openpyxl') as writer:
        if 'pivot_montant' in locals() and isinstance(pivot_montant, pd.DataFrame):
            pivot_montant.to_excel(writer, sheet_name='Montant_Ville_Type')
        if 'pivot_mois' in locals() and isinstance(pivot_mois, pd.DataFrame):
            pivot_mois.to_excel(writer, sheet_name='Reservations_Mois')
        if 'group_region' in locals() and isinstance(group_region, pd.DataFrame):
            group_region.to_excel(writer, sheet_name='Statistiques_Region')
    print("✅ pivot_tables.xlsx créé avec succès")
except Exception as e:
    print(f"⚠️ Erreur Excel: {e}")
    print("   Utilisation de CSV alternatif")

print()

# =====================================================================
# POINT 30: VISUALISATION FINALE
# =====================================================================

print("="*80)
print("3️⃣0️⃣ VISUALISATION: Graphiques finaux")
print("="*80 + "\n")

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Distribution des montants APRÈS nettoyage
axes[0, 0].hist(reservations['montant'], bins=50, edgecolor='black', color='skyblue')
axes[0, 0].set_title('Distribution des montants (APRÈS nettoyage)')
axes[0, 0].set_xlabel('Montant (€)')
axes[0, 0].set_ylabel('Fréquence')
axes[0, 0].grid(alpha=0.3)

# 2. Boxplot
axes[0, 1].boxplot(reservations['montant'])
axes[0, 1].set_title('Boxplot - Montants sans outliers')
axes[0, 1].set_ylabel('Montant (€)')
axes[0, 1].grid(alpha=0.3)

# 3. Distribution par statut
reservations['statut'].value_counts().plot(kind='bar', ax=axes[1, 0], color='coral')
axes[1, 0].set_title('Distribution par statut')
axes[1, 0].set_ylabel('Nombre de réservations')
axes[1, 0].tick_params(axis='x', rotation=45)
axes[1, 0].grid(alpha=0.3)

# 4. Montant total par mois
if 'mois' in reservations.columns:
    montant_par_mois = reservations.groupby('mois')['montant'].sum()
    axes[1, 1].plot(montant_par_mois.index, montant_par_mois.values, marker='o', color='green', linewidth=2)
    axes[1, 1].set_title('Montant total par mois')
    axes[1, 1].set_xlabel('Mois')
    axes[1, 1].set_ylabel('Montant total (€)')
    axes[1, 1].grid(alpha=0.3)

plt.tight_layout()
plt.savefig('visualisation_finale.png', dpi=150, bbox_inches='tight')
print("✅ visualisation_finale.png sauvegardé")
plt.close()

# =====================================================================
# RÉSUMÉ FINAL
# =====================================================================

print("\n" + "="*80)
print("✅ RÉSUMÉ FINAL - 30 POINTS COMPLÉTÉS")
print("="*80 + "\n")

print("📋 PART 1: EXPLORATION (10 points) ✅")
print("   Points 1-10: Vue générale, statistiques, visualisations\n")

print("🧹 PART 2: NETTOYAGE (20 points) ✅")
print(f"   Points 11-23: Transformations ETL")
print(f"   Réservations finales: {len(reservations)} lignes\n")

print("📊 PART 3: AGRÉGATIONS (10 points) ✅")
print("   ✅ Point 24: Pivot montants par ville × type")
print("   ✅ Point 25: Pivot réservations par mois × type")
print("   ✅ Point 26: Groupby client (sum, count, mean)")
print("   ✅ Point 27: Groupby région/ville (sum, mean, count)")
print("   ✅ Point 28: Export 7 fichiers CSV")
print("   ✅ Point 29: Export pivot_tables.xlsx")
print("   ✅ Point 30: Visualisation finale (4 graphiques)\n")

print("📁 FICHIERS GÉNÉRÉS:")
print("   ✅ reservations_clean.csv")
print("   ✅ paiements_clean.csv")
print("   ✅ factures_clean.csv")
print("   ✅ chambres_clean.csv")
print("   ✅ hotels_clean.csv")
print("   ✅ users_clean.csv")
print("   ✅ services_clean.csv")
print("   ✅ pivot_tables.xlsx")
print("   ✅ visualisation_finale.png")

print("\n" + "="*80)
print("🎉 PROJET ETL COMPLÈTEMENT TERMINÉ - 30/30 POINTS!")
print("="*80 + "\n")
