"""
EXPLORATION DES DONNÉES - BI Mini-projet
Module: Data Analytics & Business Intelligence
Objectif: Exploration complète des données MongoDB pour comprendre la structure,
          identifier les anomalies et préparer le nettoyage ETL

Source: MongoDB Atlas - gestion-hoteliere
"""

import pandas as pd
import numpy as np
import pymongo
from pymongo import MongoClient
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Configuration
MONGODB_ATLAS_URI = "mongodb+srv://Raef:YOUR_PASSWORD@cluster0.v6scg.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion-hoteliere"

print("=" * 80)
print("🔍 EXPLORATION DES DONNÉES - PROJET BI HÔTEL")
print("=" * 80)

# ============================================================================
# CONNEXION À MONGODB ATLAS
# ============================================================================
print("\n📍 CONNEXION À MONGODB ATLAS...")
try:
    client = MongoClient(MONGODB_ATLAS_URI)
    db = client[DATABASE_NAME]
    collections_list = db.list_collection_names()
    print(f"✅ Connecté à MongoDB Atlas - Base: {DATABASE_NAME}")
    print(f"✅ Collections disponibles: {', '.join(collections_list)}")
except Exception as e:
    print(f"❌ Erreur de connexion: {e}")
    exit()

# ============================================================================
# PARTIE 1: EXPLORATION DES COLLECTIONS (10 POINTS TP)
# ============================================================================

collections_to_analyze = ['reservations', 'chambres', 'hotels', 'users', 'paiements', 'factures', 'services']

exploration_results = {}

for collection_name in collections_to_analyze:
    print(f"\n{'='*80}")
    print(f"📊 EXPLORATION: {collection_name.upper()}")
    print(f"{'='*80}")
    
    collection = db[collection_name]
    
    try:
        # 1. AFFICHER LES PREMIÈRES LIGNES
        print(f"\n1️⃣  PREMIÈRES LIGNES ({collection_name}):")
        docs = list(collection.find().limit(3))
        df = pd.DataFrame(docs)
        print(f"   Nombre de documents: {collection.count_documents({})}")
        print(f"\n   Premières 3 lignes:")
        print(f"   {df.to_string()[:500]}...")
        
        # Charger tous les documents pour analyse
        all_docs = list(collection.find())
        df = pd.DataFrame(all_docs)
        
        # 2. AFFICHER LES INFORMATIONS GÉNÉRALES (INFO)
        print(f"\n2️⃣  INFORMATIONS GÉNÉRALES ({collection_name}):")
        print(f"   Shape: {df.shape}")
        print(f"   Colonnes: {list(df.columns)}")
        print(f"   Types de données:")
        for col, dtype in df.dtypes.items():
            print(f"      - {col}: {dtype}")
        
        # 3. STATISTIQUES DESCRIPTIVES
        print(f"\n3️⃣  STATISTIQUES DESCRIPTIVES ({collection_name}):")
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            print(f"   {df[numeric_cols].describe().to_string()}")
        else:
            print(f"   Aucune colonne numérique")
        
        # 4. VALEURS MANQUANTES
        print(f"\n4️⃣  VALEURS MANQUANTES ({collection_name}):")
        missing = df.isnull().sum()
        if missing.sum() > 0:
            print(f"   {missing[missing > 0].to_string()}")
        else:
            print(f"   ✅ Aucune valeur manquante")
        
        # 5. DOUBLONS
        print(f"\n5️⃣  DOUBLONS ({collection_name}):")
        duplicates = df.duplicated().sum()
        print(f"   Nombre de doublons: {duplicates}")
        
        # 6. OUTLIERS (pour colonnes numériques)
        print(f"\n6️⃣  OUTLIERS POTENTIELS ({collection_name}):")
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            outliers = df[(df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)]
            if len(outliers) > 0:
                print(f"   {col}: {len(outliers)} outliers détectés")
        
        # 7. VALEURS UNIQUES (pour colonnes catégorielles)
        print(f"\n7️⃣  VALEURS UNIQUES ({collection_name}):")
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            unique_count = df[col].nunique()
            print(f"   {col}: {unique_count} valeurs uniques")
            if unique_count <= 10:
                print(f"      Valeurs: {df[col].unique().tolist()}")
        
        # 8. DISTRIBUTION DES VALEURS
        print(f"\n8️⃣  DISTRIBUTION DES VALEURS ({collection_name}):")
        for col in categorical_cols[:3]:  # Top 3 colonnes catégorielles
            print(f"   {col}:")
            print(f"   {df[col].value_counts().to_string()[:200]}")
        
        exploration_results[collection_name] = {
            'count': len(df),
            'shape': df.shape,
            'columns': list(df.columns),
            'missing': missing.sum(),
            'duplicates': duplicates
        }
        
    except Exception as e:
        print(f"⚠️  Erreur lors de l'analyse de {collection_name}: {e}")

# ============================================================================
# PARTIE 2: ANALYSE CROISÉE (RELATIONS)
# ============================================================================

print(f"\n\n{'='*80}")
print("🔗 ANALYSE CROISÉE DES RELATIONS")
print(f"{'='*80}")

# Charger les principales collections
reservations_df = pd.DataFrame(list(db['reservations'].find()))
paiements_df = pd.DataFrame(list(db['paiements'].find()))
factures_df = pd.DataFrame(list(db['factures'].find()))

print(f"\n✅ Réservations: {len(reservations_df)} documents")
print(f"✅ Paiements: {len(paiements_df)} documents")
print(f"✅ Factures: {len(factures_df)} documents")

# Vérifier les relations
if 'reservation_id' in paiements_df.columns and '_id' in reservations_df.columns:
    paiements_avec_res = paiements_df['reservation_id'].isin(reservations_df['_id']).sum()
    print(f"\n📊 Paiements liés à des réservations: {paiements_avec_res}/{len(paiements_df)}")

# ============================================================================
# PARTIE 3: RÉSUMÉ FINAL
# ============================================================================

print(f"\n\n{'='*80}")
print("📋 RÉSUMÉ DE L'EXPLORATION")
print(f"{'='*80}")

print("\n📊 STATISTIQUES GLOBALES:")
for collection_name, stats in exploration_results.items():
    print(f"\n{collection_name.upper()}:")
    print(f"  📌 Documents: {stats['count']}")
    print(f"  📌 Dimensions: {stats['shape']}")
    print(f"  📌 Valeurs manquantes: {stats['missing']}")
    print(f"  📌 Doublons: {stats['duplicates']}")

print(f"\n\n{'='*80}")
print("✅ EXPLORATION TERMINÉE")
print("📁 Prochaine étape: Exécuter transformation_etl.py sur Google Colab")
print(f"{'='*80}\n")

client.close()
