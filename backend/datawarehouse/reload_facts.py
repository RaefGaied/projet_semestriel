#!/usr/bin/env python3
"""
Script pour recharger uniquement la table de faits avec les services corrigés
"""

import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'gestion_hoteliere_dw',
    'user': 'postgres',
    'password': 'raef123/*'
}

print("\n🔄 RECHARGEMENT DE LA TABLE DE FAITS...\n")

# Connexion
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# 1. Vider la table de faits
print("🗑️  Suppression des données existantes...")
cursor.execute("TRUNCATE TABLE fait_reservations RESTART IDENTITY CASCADE;")
conn.commit()
print("   ✅ Table vidée\n")

# 2. Charger les CSV
print("📥 Lecture des CSV...")
reservations = pd.read_csv('reservations_clean.csv')
print(f"   ✅ {len(reservations)} réservations\n")

# 3. Récupérer les mappings
cursor.execute("SELECT temps_id, date_complete FROM dim_temps")
temps_mapping = {str(date): id for id, date in cursor.fetchall()}

cursor.execute("SELECT hotel_id, hotel_code FROM dim_hotels")
hotel_mapping = {code: id for id, code in cursor.fetchall()}

cursor.execute("SELECT chambre_id, chambre_code FROM dim_chambres")
chambre_mapping = {code: id for id, code in cursor.fetchall()}

cursor.execute("SELECT client_id, client_code FROM dim_clients")
client_mapping = {code: id for id, code in cursor.fetchall()}

cursor.execute("SELECT statut_id, code_statut FROM dim_statut")
statut_mapping = {code: id for id, code in cursor.fetchall()}

# 4. Calculer le nombre de services
def compter_services(services_str):
    if pd.isna(services_str) or services_str == '' or services_str == '[]':
        return 0
    return services_str.count('ObjectId(')

reservations['nb_services'] = reservations['services'].apply(compter_services)
reservations['reservation_code'] = reservations.index.astype(str)

print(f"📊 Statistiques services:")
print(f"   Min: {reservations['nb_services'].min()}")
print(f"   Max: {reservations['nb_services'].max()}")
print(f"   Moyenne: {reservations['nb_services'].mean():.2f}\n")

# 5. Préparer les valeurs
print("💾 Insertion des réservations...")
values = []

for idx, row in reservations.iterrows():
    try:
        date_debut = pd.to_datetime(row.get('date_debut')).date() if pd.notna(row.get('date_debut')) else None
        date_fin = pd.to_datetime(row.get('date_fin')).date() if pd.notna(row.get('date_fin')) else None
        date_creation = pd.to_datetime(row.get('date_creation')).date() if pd.notna(row.get('date_creation')) else None
        
        temps_debut_id = temps_mapping.get(str(date_debut), 1) if date_debut else 1
        temps_fin_id = temps_mapping.get(str(date_fin), 1) if date_fin else 1
        temps_creation_id = temps_mapping.get(str(date_creation), 1) if date_creation else 1
        
        statut = row.get('statut', 'TERMINEE').upper()
        statut_id = statut_mapping.get(statut, 2)
        
        duree = (pd.to_datetime(row.get('date_fin')) - pd.to_datetime(row.get('date_debut'))).days if pd.notna(row.get('date_fin')) and pd.notna(row.get('date_debut')) else 0
        
        values.append((
            row['reservation_code'],
            temps_debut_id,
            temps_fin_id,
            temps_creation_id,
            hotel_mapping.get(str(idx % len(hotel_mapping)), 1),
            chambre_mapping.get(str(idx % len(chambre_mapping)), 1),
            client_mapping.get(str(idx % len(client_mapping)), 1),
            statut_id,
            float(row.get('montant', 0)),
            float(row.get('montant_abs', abs(row.get('montant', 0)))),
            max(0, duree),
            int(row.get('nb_services', 0)),
            row.get('mode_paiement', 'CARTE') if pd.notna(row.get('mode_paiement')) else 'CARTE'
        ))
    except Exception as e:
        print(f"   ⚠️ Erreur ligne {idx}: {e}")
        continue

# 6. Insertion
insert_query = """
INSERT INTO fait_reservations (
    reservation_code, temps_debut_id, temps_fin_id, temps_creation_id,
    hotel_id, chambre_id, client_id, statut_id,
    montant_total, montant_abs, duree_sejour, nombre_services, mode_paiement
)
VALUES %s
"""

execute_values(cursor, insert_query, values)
conn.commit()

print(f"   ✅ {len(values)} réservations insérées\n")

# 7. Vérification
cursor.execute("SELECT COUNT(*), SUM(nombre_services), AVG(nombre_services) FROM fait_reservations")
count, sum_services, avg_services = cursor.fetchone()
print(f"📊 Vérification:")
print(f"   Total réservations: {count}")
print(f"   Total services: {sum_services}")
print(f"   Moyenne services: {avg_services:.2f}\n")

cursor.execute("SELECT nombre_services, COUNT(*) FROM fait_reservations GROUP BY nombre_services ORDER BY nombre_services")
print("   Distribution:")
for nb, cnt in cursor.fetchall():
    print(f"   {nb} services: {cnt} réservations")

conn.close()
print("\n✅ RECHARGEMENT TERMINÉ!\n")
