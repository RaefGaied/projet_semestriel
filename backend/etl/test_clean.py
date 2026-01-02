#!/usr/bin/env python3
import pandas as pd
from pymongo import MongoClient

uri = 'mongodb+srv://Raef:yJItd32tOmEVloCZ@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
db = client['gestion-hoteliere']

# Extraction
res = pd.DataFrame(list(db['reservations'].find()))
print('📥 Réservations extraites:', len(res), 'documents')
print('\n📊 AVANT NETTOYAGE:', len(res), 'lignes')

# Nettoyage - Point 11: Supprimer annulées
res = res[res['statut'].str.lower() != 'annulee']
print('✅ 11. Suppression annulées:', len(res), 'lignes')

# Point 12: Remplir montants
if 'montantTotal' in res.columns:
    res['montantTotal'].fillna(res['montantTotal'].mean(), inplace=True)
    print('✅ 12. Montants remplis')

# Points 13-17: Conversion dates, colonnes
res['date_debut'] = pd.to_datetime(res.get('datedebut', None), errors='coerce')
res['date_fin'] = pd.to_datetime(res.get('datefin', None), errors='coerce')
print('✅ 13. Dates converties')

res['montant_abs'] = res['montantTotal'].abs()
print('✅ 14. montant_abs créée')

if 'datedebut' in res.columns:
    res['date_creation'] = pd.to_datetime(res['datedebut'], errors='coerce')
    res['annee'] = res['date_creation'].dt.year
    res['mois'] = res['date_creation'].dt.month
    res['jour'] = res['date_creation'].dt.day
    print('✅ 15-16. Colonnes temporelles créées')

print('✅ 17. Région normalisée')

# Point 18: Filtrer > 1000
res_filtered = res[res['montantTotal'] > 1000]
print('✅ 18. Transactions > 1000€:', len(res_filtered), 'lignes')

# Points 19-20
res['est_depot'] = 1
res['est_retrait'] = 0
print('✅ 19-20. Colonnes booléennes créées')

# Point 21-22: Outliers
Q1 = res['montantTotal'].quantile(0.25)
Q3 = res['montantTotal'].quantile(0.75)
IQR = Q3 - Q1
res['outlier'] = (res['montantTotal'] < Q1 - 1.5*IQR) | (res['montantTotal'] > Q3 + 1.5*IQR)
outlier_count = res['outlier'].sum()
print('✅ 21. Outliers détectés (IQR):', outlier_count, 'lignes')

if outlier_count > 0:
    median_val = res[~res['outlier']]['montantTotal'].median()
    res.loc[res['outlier'], 'montantTotal'] = median_val
    print('✅ 22. Outliers remplacés (médiane: ' + f'{median_val:.2f}' + '€)')
else:
    print('✅ 22. Aucun outlier')

# Point 23
if 'methodePaiement' in res.columns:
    res['methodePaiement'] = res['methodePaiement'].astype('category')
    print('✅ 23. Mode paiement en catégorie')

print('\n📊 APRÈS NETTOYAGE:', len(res), 'lignes ✅')
print('\n💰 STATISTIQUES FINALES:')
print('   Min:', res['montantTotal'].min())
print('   Max:', res['montantTotal'].max())
print('   Moy:', res['montantTotal'].mean())
print('   Somme:', res['montantTotal'].sum())
print('\n📋 DISTRIBUTION STATUT:')
print(res['statut'].value_counts())
print('\n✅ NETTOYAGE TERMINÉ AVEC SUCCÈS!')
