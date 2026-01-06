# 🏨 HôtelApp - Système de Gestion Hôtelière avec Couche BI

**Application Web complète de gestion hôtelière avec couche décisionnelle intégrée**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Power BI](https://img.shields.io/badge/Power%20BI-F2C811?style=flat&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)

---

## 📋 Table des matières

- [Description](#-description)
- [Architecture](#-architecture)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Couche Business Intelligence](#-couche-business-intelligence)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

---

## 📖 Description

**HôtelApp** est une application web full-stack de gestion hôtelière développée avec la stack MERN (MongoDB, Express, React, Node.js), enrichie d'une couche décisionnelle complète basée sur PostgreSQL et Power BI.

Le projet comprend :
- **Couche opérationnelle (OLTP)** : Gestion quotidienne des réservations, clients, chambres et services
- **Couche décisionnelle (OLAP)** : ETL, Data Warehouse, et Dashboard Power BI pour l'analyse et la prise de décision

### 🎯 Objectifs du projet

Ce projet a été développé dans le cadre du module **Data Analytics & Business Intelligence** (5ème année Ingénierie Informatique) et vise à :
- Mettre en œuvre un processus BI complet
- Concevoir et implémenter un pipeline ETL
- Construire un Data Warehouse avec modèle en étoile
- Créer des visualisations et dashboards interactifs
- Intégrer la couche décisionnelle dans l'application MERN

---

## 🏗️ Architecture

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  - Interface utilisateur (Clients & Admins)                 │
│  - Dashboard Power BI embarqué                              │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                │
│  - API RESTful                                              │
│  - Authentification JWT                                      │
│  - Gestion métier                                           │
└────────┬──────────────────────────────────┬────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────┐              ┌──────────────────────────┐
│  MongoDB Atlas   │              │  Couche BI (PostgreSQL)  │
│  (OLTP - 1295    │              │  - Data Warehouse        │
│   documents)     │              │  - Modèle en étoile      │
└────────┬─────────┘              │  - 5 dimensions + 1 fait │
         │                        └──────────┬───────────────┘
         │ ETL Python                        │
         │ (Extraction, Transform, Load)     │
         └───────────────────────────────────▼
                              ┌─────────────────────┐
                              │    Power BI         │
                              │  - 3 pages          │
                              │  - 13 mesures DAX   │
                              │  - 14 visualisations│
                              └─────────────────────┘
```

### Architecture BI Détaillée

```
MongoDB (Source) → ETL Python → PostgreSQL DW → Power BI → React Frontend
    1295 docs        Pandas      983 rows      Dashboard    Embed iframe
                   transformations  5 dim + 1 fact  13 DAX    /bi-dashboard
```

---

## ✨ Fonctionnalités

### 🎫 Côté Client
- ✅ Inscription et connexion sécurisées (JWT)
- ✅ Consultation du catalogue d'hôtels et chambres
- ✅ Recherche et filtres avancés
- ✅ Réservation en ligne
- ✅ Gestion du profil utilisateur
- ✅ Historique des réservations et factures
- ✅ Ajout de services supplémentaires

### 👨‍💼 Côté Admin
- ✅ Tableau de bord administrateur
- ✅ Gestion des hôtels (CRUD)
- ✅ Gestion des chambres et types
- ✅ Gestion des clients et utilisateurs
- ✅ Gestion des services
- ✅ Validation des réservations
- ✅ **📊 Dashboard Business Intelligence** (accès exclusif)

### 📊 Couche Business Intelligence
- ✅ **ETL complet** : Extraction MongoDB → Transformation Python → Chargement PostgreSQL
- ✅ **Data Warehouse** : Modèle en étoile (5 dimensions + 1 table de faits)
- ✅ **Dashboard Power BI** : 3 pages interactives avec storytelling
- ✅ **Intégration React** : Dashboard embarqué via iframe sécurisé
- ✅ **Insights actionnables** : 5 insights clés identifiant +77K € CA potentiel

---

## 🛠️ Technologies

### Frontend
- **React** 18.3 - Interface utilisateur
- **Redux Toolkit** - Gestion d'état
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - Requêtes HTTP
- **Lucide React** - Icônes

### Backend
- **Node.js** 20.x - Runtime JavaScript
- **Express.js** 4.x - Framework web
- **MongoDB Atlas** - Base de données opérationnelle (OLTP)
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashing des mots de passe
- **express-validator** - Validation des données

### Business Intelligence
- **Python** 3.11 - Scripts ETL
- **Pandas** - Manipulation de données
- **PostgreSQL** 18.1 - Data Warehouse (OLAP)
- **psycopg2** - Connecteur PostgreSQL
- **Power BI Desktop** - Visualisation
- **Power BI Service** - Publication et embed

---

## 📦 Installation

### Prérequis

- **Node.js** >= 18.x
- **MongoDB Atlas** (compte gratuit)
- **PostgreSQL** >= 16.x
- **Python** >= 3.11 (pour ETL)
- **Power BI Desktop** (optionnel, pour modifier le dashboard)
- **Git**

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/projet_semestriel.git
cd projet_semestriel
```

### 2. Installation Backend

```bash
cd backend
npm install
```

### 3. Installation Frontend

```bash
cd ../frontend
npm install
```

### 4. Installation dépendances Python (ETL)

```bash
cd ../backend/datawarehouse
pip install pandas pymongo psycopg2 matplotlib openpyxl
```

---

## ⚙️ Configuration

### 1. Configuration Backend

Créez un fichier `.env` dans le dossier `backend/` :

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gestion-hoteliere?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Serveur
PORT=5000
NODE_ENV=development
```

### 2. Configuration Frontend

Créez un fichier `.env` dans le dossier `frontend/` :

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Configuration PostgreSQL (Data Warehouse)

```bash
# Créer la base de données
createdb gestion_hoteliere_dw

# Exécuter le schéma
psql -d gestion_hoteliere_dw -f backend/datawarehouse/schema_star.sql
```

### 4. Exécution du pipeline ETL

```bash
cd backend/datawarehouse
python load_data_warehouse.py
```

---

## 🚀 Utilisation

### Démarrage rapide

**Terminal 1 - Backend :**
```bash
cd backend
npm start
# Serveur démarré sur http://localhost:5000
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
# Application disponible sur http://localhost:5173
```

### Accès à l'application

- **Page d'accueil** : http://localhost:5173
- **Connexion** : http://localhost:5173/login
- **Inscription** : http://localhost:5173/register
- **Dashboard BI (Admin)** : http://localhost:5173/bi-dashboard

### Comptes de test

**Admin :**
- Email : `admin@hotelapp.com`
- Mot de passe : `Admin123!`

**Client :**
- Email : `client@hotelapp.com`
- Mot de passe : `Client123!`

---

## 📊 Couche Business Intelligence

### Architecture ETL

```
📥 EXTRACTION (MongoDB)
   ├── 1295 documents extraits
   ├── 7 collections : réservations, clients, hotels, chambres, etc.
   └── Export JSON

📝 TRANSFORMATION (Python Pandas)
   ├── Nettoyage : Détection outliers (IQR), remplacement médiane
   ├── Enrichissement : Ajout dimensions (ville, type, durée)
   ├── Parsing : Services JSON → Comptage ObjectId
   └── 7 CSV générés + 3 pivots Excel + 4 visualisations

📤 CHARGEMENT (PostgreSQL)
   ├── 983 rows insérées
   ├── Modèle en étoile : 5 dimensions + 1 fait
   └── 15 indexes pour performance
```

### Data Warehouse : Modèle en Étoile

**Dimensions (5) :**
- `dim_temps` (137 dates) - Calendrier
- `dim_hotels` (20 hôtels) - Établissements avec étoiles 3-5
- `dim_chambres` (610 chambres) - 4 types (SIMPLE, DOUBLE, SUITE, DELUXE)
- `dim_clients` (101 clients) - Base clients
- `dim_statut` (5 statuts) - États des réservations

**Faits (1) :**
- `fait_reservations` (142 réservations) - Transactions avec métriques

**Vues analytiques (2) :**
- `v_analyse_reservations` - Vue dénormalisée pour Power BI
- `v_statistiques_dw` - KPIs agrégés

### Dashboard Power BI

**3 Pages avec storytelling narratif :**

**Page 1 - Dashboard Overview (État des lieux)**
- 7 KPIs principaux : 256K € CA, 142 réservations, 1802 € moyenne
- Line Chart : Saisonnalité sur 6 mois
- Bar Chart : Performance géographique (14 villes)

**Page 2 - Detailed Analysis (Analyse approfondie)**
- 4 Slicers interactifs : étoiles, année, ville, type
- Pie Chart : Répartition CA par type de chambre
- Matrix : 20 hôtels × 4 types
- Clustered Column Chart : Volume vs Valeur

**Page 3 - Executive Summary (Synthèse stratégique)**
- 4 Cards + 3 Gauges avec targets
- Table enrichie : ville, CA, contribution %, ranking, rating, badge
- 13 mesures DAX avancées (RANKX, SWITCH, DIVIDE, ALL)

### 5 Insights Clés

1. **Lyon 17%** : Ville leader (43K €), autant que les 5 dernières villes réunies
2. **DOUBLE 34%** : Produit star avec 87K € (2069 € moy. vs 1802 € global)
3. **30% sans services** : 42 clients = 76K € CA potentiel perdu
4. **Octobre -36%** : Creux saisonnier avec 18K € perdus
5. **Top 3 = 42%** : Concentration Lyon + Megève + Nice (108K €)

### Accès au Dashboard

Le dashboard Power BI est intégré dans l'application React et accessible uniquement aux **administrateurs** via :
```
http://localhost:5173/bi-dashboard
```

---

## 📁 Structure du projet

```
projet_semestriel/
├── backend/
│   ├── config/
│   │   └── db.js                      # Connexion MongoDB
│   ├── controllers/
│   │   ├── adminController.js         # Stats admin
│   │   ├── chambreController.js       # Gestion chambres
│   │   ├── factureController.js       # Factures
│   │   ├── reservationController.js   # Réservations
│   │   └── userController.js          # Authentification
│   ├── middleware/
│   │   ├── admin.js                   # Vérification rôle admin
│   │   └── auth.js                    # Vérification JWT
│   ├── models/
│   │   ├── Chambre.js                 # Schéma MongoDB
│   │   ├── Facture.js
│   │   ├── Reservation.js
│   │   ├── Service.js
│   │   └── User.js
│   ├── routes/
│   │   ├── chambreRoutes.js           # Routes API
│   │   ├── factureRoutes.js
│   │   ├── reservationRoutes.js
│   │   └── userRoutes.js
│   ├── datawarehouse/                 # 📊 COUCHE BI
│   │   ├── schema_star.sql            # Schéma PostgreSQL
│   │   ├── load_data_warehouse.py     # ETL complet
│   │   ├── reload_facts.py            # Rechargement faits
│   │   ├── fix_encoding.py            # Fix UTF-8
│   │   └── STORYTELLING_DASHBOARD.md  # Documentation
│   ├── .env                           # Variables environnement
│   ├── package.json
│   └── server.js                      # Point d'entrée
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── PowerBIDashboard.jsx    # 📊 Dashboard BI
│   │   │   │   └── PowerBIDashboard.css
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ChambresPage.jsx
│   │   │   ├── HotelsPage.jsx
│   │   │   ├── ReservationsPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── ClientDashboard.jsx
│   │   ├── services/
│   │   │   ├── apiClient.js           # Axios + intercepteurs
│   │   │   ├── userService.js
│   │   │   ├── chambreService.js
│   │   │   └── reservationService.js
│   │   ├── store/
│   │   │   ├── store.js               # Redux store
│   │   │   └── authSlice.js           # Auth state
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx       # Route protégée
│   │   ├── App.jsx                    # Routing principal
│   │   └── main.jsx                   # Point d'entrée
│   ├── .env                           # Variables environnement
│   ├── package.json
│   └── vite.config.js
│
├── GUIDE_SOUTENANCE_5MIN.md           # 🎓 Guide présentation
├── INTEGRATION_POWERBI_GUIDE.md       # 📖 Guide intégration
├── Gestion_Hoteliere_Dashboard.pbix   # 📊 Fichier Power BI
└── README.md                          # 📄 Ce fichier
```

---

## 🔌 API Endpoints

### Authentification
```
POST   /api/users/register          # Inscription
POST   /api/users/login             # Connexion
GET    /api/users/profile           # Profil utilisateur (Auth)
PUT    /api/users/profile           # Modifier profil (Auth)
PUT    /api/users/change-password   # Changer mot de passe (Auth)
DELETE /api/users/account           # Supprimer compte (Auth)
```

### Hôtels
```
GET    /api/hotels                  # Liste des hôtels
GET    /api/hotels/:id              # Détails hôtel
POST   /api/hotels                  # Créer hôtel (Admin)
PUT    /api/hotels/:id              # Modifier hôtel (Admin)
DELETE /api/hotels/:id              # Supprimer hôtel (Admin)
```

### Chambres
```
GET    /api/chambres                # Liste des chambres
GET    /api/chambres/:id            # Détails chambre
POST   /api/chambres                # Créer chambre (Admin)
PUT    /api/chambres/:id            # Modifier chambre (Admin)
DELETE /api/chambres/:id            # Supprimer chambre (Admin)
```

### Réservations
```
GET    /api/reservations            # Mes réservations (Auth)
GET    /api/reservations/:id        # Détails réservation (Auth)
POST   /api/reservations            # Créer réservation (Auth)
PUT    /api/reservations/:id/cancel # Annuler réservation (Auth)
GET    /api/reservations/admin/all  # Toutes réservations (Admin)
```

### Admin
```
GET    /api/admin/stats             # Statistiques globales (Admin)
GET    /api/users/admin/users       # Liste utilisateurs (Admin)
GET    /api/users/admin/clients     # Liste clients (Admin)
PUT    /api/users/admin/clients/:id/toggle  # Activer/Désactiver (Admin)
```

---

## 🖼️ Screenshots

### Page d'accueil
![Homepage](screenshots/homepage.png)

### Dashboard Admin
![Admin Dashboard](screenshots/admin-dashboard.png)

### Dashboard Business Intelligence
![Power BI Dashboard](screenshots/powerbi-dashboard.png)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** votre branche (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Règles de contribution

- Suivre les conventions de code existantes
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire
- Respecter le code de conduite du projet

---

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Raef Ghanem**
- GitHub : [@raefghanem](https://github.com/raefghanem)
- Email : raefghanem18@gmail.com

---

## 📚 Documentation complémentaire

- [Guide de soutenance (5 minutes)](GUIDE_SOUTENANCE_5MIN.md)
- [Guide d'intégration Power BI](INTEGRATION_POWERBI_GUIDE.md)
- [Storytelling Dashboard](backend/datawarehouse/STORYTELLING_DASHBOARD.md)

---

## 🙏 Remerciements

- **Dr-Ing. Nedya BOUFARES** - Encadrant du module Data Analytics & BI
- **MongoDB Atlas** - Base de données cloud gratuite
- **Power BI** - Outil de visualisation Microsoft
- **Stack MERN Community** - Documentation et ressources

---

## 📊 Statistiques du projet

- **Lignes de code** : ~15,000
- **Commits** : 100+
- **Durée développement** : 3 mois
- **Score final** : **101/100** (avec bonus)

---

## 🎯 Résultats & Impact

### Métriques BI
- **CA Total analysé** : 255,874 €
- **Réservations traitées** : 142
- **CA potentiel identifié** : +77,000 €
- **Actions concrètes** : 5 leviers de croissance

### Stack technique maîtrisée
✅ MERN (MongoDB, Express, React, Node.js)  
✅ Python ETL (Pandas, Psycopg2)  
✅ PostgreSQL Data Warehouse  
✅ Power BI (DAX, Power Query, Power Pivot)  
✅ Redux Toolkit, JWT, REST API  

---

<div align="center">

**⭐ Si ce projet vous a été utile, n'hésitez pas à mettre une étoile ! ⭐**

Made with ❤️ by [Raef Ghanem](https://github.com/raefghanem)

</div>
