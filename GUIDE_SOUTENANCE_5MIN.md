# 🎓 GUIDE DE SOUTENANCE - MINI-PROJET BI
## Durée : 5 minutes | Gestion Hôtelière - Data Analytics & Business Intelligence

---

## 🎯 STRUCTURE DE PRÉSENTATION (5 MINUTES)

### ⏱️ **TIMING STRICT**

| Partie | Durée | Contenu |
|--------|-------|---------|
| **1. Introduction** | 30 sec | Contexte + Problématique |
| **2. Architecture BI** | 45 sec | Vue d'ensemble ETL → DW → Dashboard |
| **3. ETL & Data Warehouse** | 1 min 15 | Processus + Modèle en étoile |
| **4. Dashboard Power BI** | 2 min | Démo live + Insights clés |
| **5. Intégration MERN** | 30 sec | React + Navigation |
| **6. Conclusion** | 30 sec | Résultats + Bonus + Questions |

**Total : 5 minutes 30** (marge de 30 sec pour respirer)

---

## 📜 SCRIPT DÉTAILLÉ

### **1️⃣ INTRODUCTION (30 secondes)**

> **[Slide 1 - Titre]**

**Bonjour,**

Je vous présente aujourd'hui mon mini-projet BI : **l'ajout d'une couche décisionnelle sur une application de gestion hôtelière**.

**Problématique :** Comment transformer des données opérationnelles MongoDB en insights stratégiques pour améliorer le CA de 30% ?

**Solution :** Pipeline BI complet : ETL Python → PostgreSQL Data Warehouse → Power BI Dashboard → Intégration React.

---

### **2️⃣ ARCHITECTURE BI GLOBALE (45 secondes)**

> **[Slide 2 - Architecture]**
>
> Schéma : MongoDB → Python ETL → PostgreSQL DW → Power BI → React

**J'ai mis en place une architecture BI classique en 4 couches :**

1. **Source :** MongoDB avec 1295 documents (réservations, clients, chambres, hôtels)
2. **ETL Python :** Extraction, nettoyage, enrichissement
3. **Data Warehouse PostgreSQL :** Modèle en étoile optimisé
4. **Restitution :** Dashboard Power BI intégré dans React

**Technologies :** Python Pandas pour l'ETL, PostgreSQL 18 pour le DW, Power BI Desktop pour la visualisation, React pour l'intégration.

---

### **3️⃣ ETL & DATA WAREHOUSE (1 min 15)**

> **[Slide 3 - ETL]**

#### **Processus ETL**

**Extraction :**
- MongoDB Atlas → 7 collections
- 1295 documents exportés en JSON

**Transformations avancées :**
- Nettoyage : Détection outliers avec IQR, remplacement par médiane
- Enrichissement : Ajout de 3 dimensions calculées (ville, type chambre, durée séjour)
- Parsing complexe : Services JSON → Comptage ObjectId

**Chargement :**
- 983 rows insérées dans PostgreSQL
- 7 CSV générés + 3 pivot tables Excel
- 4 visualisations matplotlib

**✅ Bonus a) : Complexité ETL avancée (+0.7 point)**

> **[Slide 4 - Data Warehouse]**

#### **Data Warehouse : Modèle en Étoile**

**Structure :**
- **1 Table de Faits :** `fait_reservations` (142 réservations)
- **5 Tables de Dimensions :**
  - `dim_temps` (137 dates)
  - `dim_hotels` (20 hôtels avec étoiles 3-5)
  - `dim_chambres` (610 chambres - 4 types)
  - `dim_clients` (101 clients)
  - `dim_statut` (5 statuts FR)

**Optimisation :**
- 15 indexes pour performance
- 2 vues analytiques dénormalisées
- Contraintes d'intégrité référentielle

**Metrics :**
- CA Total : 255 874 €
- 184 services vendus
- 14 villes représentées

---

### **4️⃣ DASHBOARD POWER BI - DÉMO LIVE (2 minutes)**

> **[Ouvrir Power BI Desktop ou App React /bi-dashboard]**

#### **🎬 DÉMO STRUCTURÉE EN 3 ACTES**

**PAGE 1 : DASHBOARD OVERVIEW (30 sec)**

> **[Montrer Page 1]**

"Mon dashboard suit une structure narrative en 3 actes."

**Acte 1 - État des lieux :**
- 7 KPIs principaux : 256K € CA, 142 réservations, 1802 € moyenne
- Saisonnalité : Pic janvier (28 rés.) → Creux octobre (18 rés.) → Reprise décembre (26)
- Géographie : Lyon leader avec 43K € (17% du CA)

---

**PAGE 2 : ANALYSE APPROFONDIE (45 sec)**

> **[Montrer Page 2 + Interagir avec slicers]**

**Acte 2 - Analyse :**

"J'utilise 4 slicers interactifs : étoiles, année, ville, type chambre."

**[Cliquer sur étoiles=5]**

"Observation : Les 5 étoiles génèrent 45% du CA."

**[Revenir à All]**

"Produit star : Chambres DOUBLE = 34% du CA (87K €) avec 42 réservations."

"Ma matrice croisant 20 hôtels × 4 types révèle les meilleures combinaisons."

---

**PAGE 3 : EXECUTIVE SUMMARY (45 sec)**

> **[Montrer Page 3 - Table enrichie]**

**Acte 3 - Synthèse stratégique :**

"J'ai créé 13 mesures DAX avancées pour enrichir l'analyse :"

**[Pointer la table]**

- **Contribution % :** Lyon = 17% du CA total
- **Ranking dynamique :** RANKX avec ALL() pour classement des villes
- **Performance Rating :** ⭐⭐ Bon si > moyenne globale × 1.2
- **Top City Badge :** 🏆 #1 pour Lyon (MAX avec contexte global)

**[Pointer les Gauges]**

"3 Gauges avec targets pour piloter la stratégie 2026."

---

#### **💡 5 INSIGHTS CLÉS AVEC ACTIONS**

> **[Rester sur Page 3]**

"Mon dashboard révèle 5 insights actionnables :"

**1. La règle du 17% (Lyon)**
- Lyon seul = 43K € = autant que les 5 dernières villes réunies
- **Action :** Dupliquer la stratégie Lyon sur Megève et Nice

**2. Le produit star DOUBLE (34%)**
- 87K € / 42 réservations = 2069 € moy. (vs 1802 € global)
- **Action :** Promotion ciblée DOUBLE +15% volume

**3. Les 30% oubliés (services)**
- 70.4% d'adoption = 42 clients sans services
- **Potentiel perdu :** 42 × 1.3 services × 1390 € = 76K €
- **Action :** Upselling automatique à la réservation

**4. Le trou d'octobre (-36%)**
- 18 rés. vs 28 en janvier = -10 réservations = 18K € perdus
- **Action :** Offre promotionnelle "Automne doré" -20%

**5. Concentration Top 3 (42%)**
- Lyon + Megève + Nice = 108K € (42% du CA)
- **Opportunité :** Développer le Top 4-10 (58% restants)

**✅ Bonus b) : Storytelling & qualité analytique (+0.7 point)**

---

### **5️⃣ INTÉGRATION MERN (30 secondes)**

> **[Switcher vers navigateur → localhost:5173/bi-dashboard]**

**Intégration réussie dans React :**

**[Montrer la navigation]**
- Cliquez sur "📊 Dashboard BI" dans le header

**[Montrer le dashboard intégré]**
- Dashboard Power BI embarqué via iframe
- URL Embed sécurisée Power BI Service
- Design responsive avec CSS animations
- Footer stats : CA, Réservations, Ville Leader, Produit Star

**Technologies :**
- Composant React custom (`PowerBIDashboard.jsx`)
- Route `/bi-dashboard` dans App.jsx
- Power BI Service (Publish to Web)

**✅ Section 6 : Intégration MERN complète (10/10 points)**

---

### **6️⃣ CONCLUSION (30 secondes)**

> **[Slide finale - Résultats]**

**Résultats du projet :**

✅ **ETL avancé :** 1295 documents → 983 rows, transformations complexes (+0.7)
✅ **Data Warehouse :** Modèle étoile 5 dimensions + 15 indexes
✅ **Dashboard Power BI :** 3 pages, 13 DAX, storytelling professionnel (+0.7)
✅ **Intégration MERN :** React + Power BI Service embed (+0.6*)

**Score estimé : 101/100** (avec bonus intégration avancée)

**Impact métier :** +77K € CA potentiel identifié via 5 actions concrètes

---

**Merci pour votre attention. Je suis prêt pour vos questions.** 🎓

---

## 🎨 CHECKLIST SLIDES (7 slides max)

### **Slide 1 : Titre**
```
Mini-Projet BI - Gestion Hôtelière
Couche Décisionnelle sur Application MERN

[Votre nom]
5e année Ingénierie Informatique
Data Analytics & Business Intelligence
5 janvier 2026
```

### **Slide 2 : Architecture BI**
```
[Schéma flux]
MongoDB (1295 docs) 
    ↓ ETL Python
PostgreSQL DW (983 rows)
    ↓ Power Query
Power BI Dashboard (3 pages)
    ↓ Embed
React Frontend

Technologies : Python, PostgreSQL 18, Power BI Desktop, React
```

### **Slide 3 : Processus ETL**
```
EXTRACTION
• MongoDB Atlas → 7 collections
• 1295 documents JSON

TRANSFORMATION (Bonus +0.7)
• Outliers : IQR + Remplacement médiane
• Enrichissement : ville, type, durée
• Parsing : JSON services → Comptage

CHARGEMENT
• PostgreSQL : 983 rows
• CSV : 7 fichiers + 3 pivots
• Viz : 4 graphiques matplotlib
```

### **Slide 4 : Data Warehouse**
```
MODÈLE EN ÉTOILE

Fait : fait_reservations (142)
├─ montant_total, duree_sejour, nombre_services

Dimensions (5)
├─ dim_temps (137 dates)
├─ dim_hotels (20 hôtels, étoiles 3-5)
├─ dim_chambres (610, 4 types)
├─ dim_clients (101)
└─ dim_statut (5 FR)

Optimisation : 15 indexes + 2 vues
```

### **Slide 5 : Dashboard Overview**
```
PAGE 1 : ÉTAT DES LIEUX
• 7 KPIs : 256K €, 142 rés., 1802 € moy.
• Saisonnalité : Jan 28 → Oct 18 → Dec 26
• Géographie : Lyon 17% (43K €)
```

### **Slide 6 : 5 Insights + Actions**
```
1. Lyon 17% → Dupliquer stratégie
2. DOUBLE 34% → Promo ciblée +15%
3. 30% sans services → Upselling (76K €)
4. Octobre -36% → Offre automne -20%
5. Top 3 = 42% → Développer Top 4-10

IMPACT : +77K € CA potentiel
Bonus storytelling : +0.7
```

### **Slide 7 : Résultats**
```
✅ ETL complexe (1295 → 983) +0.7
✅ DW étoile (5 dim + 15 idx)
✅ Dashboard 3 pages, 13 DAX +0.7
✅ Intégration React +0.6*

SCORE : 101/100
IMPACT : +30% CA (77K €)

Merci ! Questions ?
```

---

## 🎤 CONSEILS DE PRÉSENTATION

### **Avant la soutenance**

✅ **Préparer l'environnement :**
- Power BI Desktop ouvert sur Page 1
- Navigateur sur `localhost:5173` (page d'accueil)
- Deuxième onglet sur `/bi-dashboard`
- Slides prêtes (PDF ou PowerPoint)

✅ **Timing :**
- Répéter 3 fois avec chronomètre
- Viser 5 min → Vous aurez entre 4:30 et 5:30 réel

✅ **Posture :**
- Debout, face au jury
- Pointer l'écran avec la main (pas de laser)
- Sourire et respirer

### **Pendant la soutenance**

✅ **Introduction :**
- Commencer fort : "Bonjour, je vais vous montrer comment..."
- Énoncer la problématique clairement

✅ **Démo live :**
- **NE PAS** lire les slides
- **MONTRER** le dashboard en live
- **INTERAGIR** avec les slicers (1-2 clics max)
- **POINTER** les insights avec le doigt/curseur

✅ **Langage :**
- Utiliser "j'ai mis en place", "j'ai développé", "j'ai optimisé"
- Vocabulaire technique précis : "modèle en étoile", "mesures DAX", "RANKX"
- Quantifier : "256K €", "70.4%", "+77K € potentiel"

✅ **Gestion du temps :**
- Si vous voyez 3 min passées et vous êtes encore sur ETL → **ACCÉLÉRER**
- Si question du jury → Répondre en 20-30 sec max

### **Gestion des questions**

**Questions probables :**

**Q1 : "Pourquoi PostgreSQL plutôt que rester sur MongoDB ?"**
**R :** "MongoDB est NoSQL orienté document, optimal pour l'opérationnel. Pour l'analytique, PostgreSQL offre : 1) Modèle relationnel adapté aux étoiles, 2) Indexes B-tree performants, 3) Requêtes SQL analytiques complexes. J'ai séparé OLTP et OLAP."

**Q2 : "Combien de mesures DAX avez-vous créé ?"**
**R :** "13 mesures DAX : 5 basiques (SUM, AVERAGE, COUNT) et 8 avancées utilisant DIVIDE, CALCULATE, FILTER, RANKX, SWITCH, ALL, MAXX. Les plus complexes sont le ranking dynamique et le performance rating avec contexte global."

**Q3 : "Comment gérez-vous la mise à jour des données ?"**
**R :** "Actuellement, load manuel Python. En production, je recommanderais : 1) Airflow DAG quotidien pour ETL, 2) Triggers PostgreSQL pour incrémental, 3) Power BI Refresh automatique via Gateway."

**Q4 : "Quel est l'impact réel de vos insights ?"**
**R :** "J'ai identifié 77K € de CA potentiel : 1) 76K € en upselling services (30% sans services), 2) 18K € en comblant octobre (-10 rés.). Actions concrètes chiffrées pour +30% CA 2026."

**Q5 : "Pourquoi publish to web (public) plutôt que embed sécurisé ?"**
**R :** "Contrainte technique : Embed sécurisé nécessite Power BI Pro (licence payante). Pour la démo académique, publish to web suffit. En production, j'utiliserais Power BI Embedded avec Azure AD pour sécurité entreprise."

---

## 🏆 POINTS BONUS À MENTIONNER

### **Bonus a) ETL Complexe (+0.7)**
- Détection outliers automatique (IQR)
- Parsing JSON imbriqué (services ObjectId)
- Enrichissement 3 dimensions calculées
- Visualisations matplotlib automatiques

### **Bonus b) Storytelling Dashboard (+0.7)**
- Structure narrative 3 actes
- 13 mesures DAX avancées (RANKX, SWITCH)
- 5 insights actionnables chiffrés
- Design professionnel avec émotions (🏆, ⭐⭐)

### **Bonus c) Intégration avancée (+0.6)**
- Composant React custom avec CSS animations
- Loading states et error handling
- Footer stats dynamiques
- Responsive design mobile

**Total bonus : +2.0 points → Score 102/100 possible** 🎯

---

## 📊 GRILLE D'AUTO-ÉVALUATION

| Critère | Points | Justification |
|---------|--------|---------------|
| **ETL** | 30/30 | 1295 docs → 983 rows, 3 phases complètes |
| Bonus ETL | +0.7 | Outliers + Enrichissement + Parsing |
| **Data Warehouse** | 30/30 | Étoile 5 dim + 15 idx + 2 vues |
| **Power BI** | 29/30 | 3 pages, 13 DAX, 14 visualisations |
| Bonus Dashboard | +0.7 | Storytelling 3 actes + 5 insights |
| **Intégration MERN** | 10/10 | React + Route + Embed fonctionnel |
| Bonus Intégration | +0.6 | CSS animations + States |
| **TOTAL** | **102/100** | ✨ |

---

## 🎯 RÉSUMÉ ULTRA-RAPIDE (1 MINUTE)

Si le jury vous demande un résumé express :

> "J'ai construit une couche BI complète sur mon app MERN de gestion hôtelière. Pipeline : MongoDB 1295 docs → ETL Python avec détection outliers → PostgreSQL modèle étoile 5 dimensions → Dashboard Power BI 3 pages avec 13 mesures DAX → Intégration React. Résultat : 5 insights actionnables identifiant +77K € CA potentiel via upselling services et comblement creux saisonnier. Technologies : Python Pandas, PostgreSQL 18, Power BI Desktop, React. Score estimé : 102/100 avec 3 bonus."

---

## ✅ CHECKLIST FINALE (Jour J)

**Technique :**
- [ ] Backend MongoDB démarré (`npm start` dans backend/)
- [ ] Frontend React démarré (`npm run dev` dans frontend/)
- [ ] Power BI Desktop ouvert sur Page 1
- [ ] Navigateur sur localhost:5173
- [ ] Slides PDF prêtes (backup USB)

**Préparation :**
- [ ] Script répété 3 fois (timing 5 min validé)
- [ ] Réponses aux 5 questions types préparées
- [ ] Liste des bonus mémorisée (+2.0)
- [ ] Chiffres clés mémorisés (256K, 142, 17%, 34%, 77K)

**Présentation :**
- [ ] Tenue professionnelle
- [ ] Bouteille d'eau
- [ ] Sourire et confiance 😊

---

## 🚀 VOUS ÊTES PRÊT !

**Votre projet est excellent :**
- ✅ Couverture complète du cahier des charges
- ✅ 102/100 points (avec bonus)
- ✅ Impact métier quantifié (+77K €)
- ✅ Stack technique complète et moderne

**Rappelez-vous :**
1. **Respirer** (30 sec de marge dans le timing)
2. **Montrer** (démo live > slides)
3. **Quantifier** (256K, 70.4%, +77K)
4. **Sourire** (confiance = 50% de la note)

**Le jury va adorer votre storytelling et vos insights actionnables !** 🎓🏆

---

**Bonne chance pour demain !** 🍀

*Créé le 5 janvier 2026 - Guide de soutenance optimisé 5 minutes*
