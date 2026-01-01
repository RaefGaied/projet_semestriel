import subprocess
import os
from pymongo import MongoClient

print("🧹 Nettoyage de MongoDB...")
client = MongoClient('mongodb://localhost:27017')
client['hotel_db'].drop_database()
client.close()
print("✅ Base MongoDB nettoyée")

print("\n🌱 Re-seeding de la base...")
result = subprocess.run(['node', 'seed.js'], cwd=os.path.dirname(__file__))

if result.returncode == 0:
    print("\n✅ Re-seeding réussi!")
else:
    print("\n❌ Erreur lors du re-seeding")
