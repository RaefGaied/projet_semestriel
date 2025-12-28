## 🚀 Guide de démarrage - Frontend

### Étape 1 : Installer les dépendances

```bash
cd frontend
npm install
```

### Étape 2 : Assurez-vous que le backend tourne

```bash
cd backend
npm run dev
# ou
node server.js
```

Le backend doit être sur `http://localhost:5000`

### Étape 3 : Lancer le frontend

```bash
cd frontend
npm run dev
```

L'app sera accessible sur `http://localhost:3000`

---

## 📊 Architecture & Concepts clés

### 1. **Redux State Management**
```javascript
// Store structure
{
  auth: { user, token, loading, error },
  chambres: { chambres[], loading, error },
  reservations: { reservations[], loading, error }
}
```

### 2. **Authentication Flow**
```
Login/Register → JWT Token → localStorage
↓
Axios Interceptor → Ajoute token à chaque requête
↓
401 Error → Logout & Redirect to /login
```

### 3. **Routes Protégées**
```jsx
<Route
  path="/admin"
  element={<PrivateRoute requiredRole="admin"><AdminPage /></PrivateRoute>}
/>
```

### 4. **Async Thunks (Redux Toolkit)**
```javascript
// Les thunks gèrent les appels API
export const login = createAsyncThunk('auth/login', async (data) => {
  // Appel API
  // Sauvegarde token
  // Retourne user
})
```

---

## 🧪 Scénarios de test

### 1️⃣ Test d'inscription
1. Aller à `/register`
2. Remplir le formulaire
3. Cliquer "S'inscrire"
4. Vérifier que vous êtes redirigé vers `/login`

### 2️⃣ Test de connexion
1. Aller à `/login`
2. Entrer les identifiants
3. Vérifier que le token est sauvegardé
4. Vérifier que le header affiche votre nom

### 3️⃣ Test des chambres
1. Aller à `/chambres`
2. Filtrer par type et prix
3. Cliquer "Réserver" (si connecté)

### 4️⃣ Test des réservations (Client)
1. Aller à `/reservations`
2. Créer une nouvelle réservation
3. Voir votre réservation dans la liste
4. Annuler une réservation

### 5️⃣ Test Admin
1. Se connecter avec un compte admin
2. Aller à `/admin`
3. CRUD sur les chambres
4. Voir les statistiques

---

## 🐛 Debugging

### Vérifier l'état Redux
```javascript
// Dans la console du navigateur
window.__REDUX_DEVTOOLS_EXTENSION__
```

### Vérifier le token
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

### Vérifier les requêtes API
Aller dans les DevTools → Network → Vérifier les headers `Authorization`

---

## 📝 Points importants pour la soutenance

✅ **Architecture SPA** complète
✅ **Redux Toolkit** pour le state centralisé
✅ **JWT** et sécurité des routes
✅ **Axios interceptors** pour l'automatisation
✅ **Design responsive** avec Tailwind
✅ **Gestion des erreurs** complète
✅ **Rôles** (Client/Admin)

---

## 🔗 Endpoints testés

| Endpoint | Méthode | Authentification | Description |
|----------|---------|-----------------|-------------|
| `/api/users/register` | POST | Non | Créer un compte |
| `/api/users/login` | POST | Non | Se connecter |
| `/api/chambres` | GET | Non | Lister les chambres |
| `/api/chambres` | POST | Admin | Créer une chambre |
| `/api/reservations` | POST | Client | Créer une réservation |
| `/api/reservations/me` | GET | Client | Voir mes réservations |
| `/api/reservations/annuler/:id` | PUT | Client | Annuler une réservation |
| `/api/reservations/terminer/:id` | PUT | Admin | Terminer un séjour |
| `/api/factures` | POST | Admin | Générer une facture |
| `/api/factures/:resId` | GET | Auth | Voir une facture |
| `/api/admin/stats` | GET | Admin | Stats du dashboard |

---

## 💡 Améliorations futures possibles

1. **Paiement en ligne** (Stripe/PayPal)
2. **Notifications en temps réel** (WebSocket)
3. **Chat support** (Socket.io)
4. **Avis & commentaires** des clients
5. **Multi-langue** (i18n)
6. **Dark Mode** 🌙
7. **Calendrier interactif** pour les réservations

