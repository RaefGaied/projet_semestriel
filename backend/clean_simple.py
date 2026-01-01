from pymongo import MongoClient

# Connexion et nettoyage ultra-rapide
client = MongoClient('mongodb://localhost:27017')
db = client['hotel_db']

# Supprimer TOUTE la base
db.drop_database()

print("✅ Base nettoyée!")
client.close()
