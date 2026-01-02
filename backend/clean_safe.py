from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client['gestion-hoteliere']

# Afficher avant
print("📊 AVANT nettoyage:")
stats_before = db.command('dbstats')
print(f"   Collections: {stats_before['collections']}")
print(f"   Documents: {stats_before.get('objects', 0)}")

# Confirmer
response = input("\n⚠️  Êtes-vous sûr de vouloir nettoyer? (oui/non): ").strip().lower()
if response not in ['oui', 'yes', 'o', 'y']:
    print("❌ Annulé")
    sys.exit(1)

# Nettoyer
collections = db.list_collection_names()
for col in collections:
    deleted = db[col].delete_many({}).deleted_count
    print(f"✅ {col}: {deleted} documents supprimés")

# Afficher après
print("\n📊 APRÈS nettoyage:")
stats_after = db.command('dbstats')
print(f"   Collections: {stats_after['collections']}")
print(f"   Documents: {stats_after.get('objects', 0)}")

print("\n🎉 Nettoyage terminé!")
client.close()
