#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix encoding for status labels
"""

import psycopg2

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'gestion_hoteliere_dw',
    'user': 'postgres',
    'password': 'raef123/*'
}

print("\n🔧 CORRECTION DE L'ENCODAGE...\n")

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# Mettre à jour les libellés avec les bons accents
updates = [
    ('VALIDEE', 'Validée', 'Réservation confirmée et validée'),
    ('TERMINEE', 'Terminée', 'Séjour terminé avec succès'),
    ('ANNULEE', 'Annulée', 'Réservation annulée'),
    ('CONFIRMEE', 'Confirmée', 'Réservation confirmée'),
    ('EN_ATTENTE', 'En attente', 'Réservation en attente de confirmation')
]

for code, libelle, desc in updates:
    cursor.execute(
        "UPDATE dim_statut SET libelle_statut = %s, description = %s WHERE code_statut = %s",
        (libelle, desc, code)
    )
    print(f"   ✅ {code} → {libelle}")

conn.commit()

# Vérification
cursor.execute("SELECT code_statut, libelle_statut FROM dim_statut ORDER BY statut_id")
print("\n📊 Vérification:")
for code, libelle in cursor.fetchall():
    print(f"   {code}: {libelle}")

conn.close()
print("\n✅ ENCODAGE CORRIGÉ!\n")
