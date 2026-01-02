from pymongo import MongoClient

# Connexion et nettoyage ultra-rapide
client = MongoClient('mongodb://localhost:27017')
db = client['gestion-hoteliere']

# Supprimer TOUTE la base
db.drop_database()

print("✅ Base nettoyée!")
client.close()
