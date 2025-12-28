/**
 * ========================================
 * VISUAL ARCHITECTURE OVERVIEW
 * ========================================
 * 
 * This file provides a visual representation of the application
 * architecture and how all components work together.
 */

/**
 * ==========================================
 * APPLICATION ARCHITECTURE DIAGRAM
 * ==========================================
 * 
 * ┌─────────────────────────────────────────────────────┐
 * │                   BROWSER                           │
 * │                                                     │
 * │  ┌──────────────────────────────────────────────┐  │
 * │  │           React Application (Vite)           │  │
 * │  │                                              │  │
 * │  │  ┌────────────────────────────────────────┐ │  │
 * │  │  │         Redux Store                    │ │  │
 * │  │  │                                        │ │  │
 * │  │  │  ├── authSlice                         │ │  │
 * │  │  │  │   ├── user { id, nom, email, role }│ │  │
 * │  │  │  │   ├── token                         │ │  │
 * │  │  │  │   ├── loading                       │ │  │
 * │  │  │  │   └── error                         │ │  │
 * │  │  │  │                                    │ │  │
 * │  │  │  ├── chambreSlice                      │ │  │
 * │  │  │  │   ├── chambres []                   │ │  │
 * │  │  │  │   ├── loading                       │ │  │
 * │  │  │  │   └── error                         │ │  │
 * │  │  │  │                                    │ │  │
 * │  │  │  └── reservationSlice                  │ │  │
 * │  │  │      ├── reservations []               │ │  │
 * │  │  │      ├── loading                       │ │  │
 * │  │  │      └── error                         │ │  │
 * │  │  └────────────────────────────────────────┘ │  │
 * │  │                    ▲                         │  │
 * │  │                    │ dispatch actions        │  │
 * │  │                    │                         │  │
 * │  │  ┌────────────────────────────────────────┐ │  │
 * │  │  │         React Router                   │ │  │
 * │  │  │                                        │ │  │
 * │  │  │  Public Routes:                        │ │  │
 * │  │  │  ├── /                                 │ │  │
 * │  │  │  ├── /hotels                           │ │  │
 * │  │  │  ├── /hotels/:id                       │ │  │
 * │  │  │  ├── /chambres                         │ │  │
 * │  │  │  ├── /login                            │ │  │
 * │  │  │  └── /register                         │ │  │
 * │  │  │                                        │ │  │
 * │  │  │  Client Routes (Protected):            │ │  │
 * │  │  │  ├── /dashboard                        │ │  │
 * │  │  │  ├── /reservations                     │ │  │
 * │  │  │  ├── /factures                         │ │  │
 * │  │  │  └── /profile                          │ │  │
 * │  │  │                                        │ │  │
 * │  │  │  Admin Routes (Protected):             │ │  │
 * │  │  │  └── /admin (with 6 tabs)              │ │  │
 * │  │  └────────────────────────────────────────┘ │  │
 * │  │                    ▲                         │  │
 * │  │                    │ useSelector, navigate   │  │
 * │  │                    │                         │  │
 * │  │  ┌────────────────────────────────────────┐ │  │
 * │  │  │           Components                   │ │  │
 * │  │  │                                        │ │  │
 * │  │  │  ├── Header (Navigation)               │ │  │
 * │  │  │  ├── Pages (10 total)                  │ │  │
 * │  │  │  │   ├── Public (6)                    │ │  │
 * │  │  │  │   ├── Client (4)                    │ │  │
 * │  │  │  │   └── Admin (1)                     │ │  │
 * │  │  │  ├── Footer                            │ │  │
 * │  │  │  ├── Loading Spinner                   │ │  │
 * │  │  │  └── Toast Container                   │ │  │
 * │  │  └────────────────────────────────────────┘ │  │
 * │  │                    ▼                         │  │
 * │  │         render & collect user input         │  │
 * │  └──────────────────────────────────────────────┘  │
 * │                                                     │
 * └─────────────────────────────────────────────────────┘
 *                        ▼ HTTP Requests
 *
 * ┌─────────────────────────────────────────────────────┐
 * │               BACKEND SERVER                        │
 * │                                                     │
 * │  ┌──────────────────────────────────────────────┐  │
 * │  │         API Endpoints                        │  │
 * │  │                                              │  │
 * │  │  ├── POST /api/auth/register                 │  │
 * │  │  ├── POST /api/auth/login                    │  │
 * │  │  ├── GET /api/hotels                         │  │
 * │  │  ├── GET /api/chambres                       │  │
 * │  │  ├── POST /api/reservations                  │  │
 * │  │  ├── GET /api/mes-reservations               │  │
 * │  │  ├── GET /api/factures                       │  │
 * │  │  └── ADMIN /api/admin/*                      │  │
 * │  └──────────────────────────────────────────────┘  │
 * │                    ▼                               │
 * │  ┌──────────────────────────────────────────────┐  │
 * │  │      Database (MongoDB)                      │  │
 * │  │                                              │  │
 * │  │  ├── users                                   │  │
 * │  │  ├── hotels                                  │  │
 * │  │  ├── chambres                                │  │
 * │  │  ├── reservations                            │  │
 * │  │  ├── factures                                │  │
 * │  │  └── services                                │  │
 * │  └──────────────────────────────────────────────┘  │
 * │                                                     │
 * └─────────────────────────────────────────────────────┘
 */

/**
 * ==========================================
 * REQUEST/RESPONSE FLOW
 * ==========================================
 */

// USER LOGIN FLOW:
/*
1. User enters email/password
   └─> LoginPage.jsx receives input

2. Click "Connexion" button
   └─> handleSubmit() validates form (HTML5)
       └─> dispatch(login({email, password}))
           └─> authSlice.js login thunk
               └─> userService.login()
                   └─> apiClient POST /api/auth/login
                       └─> Backend validates credentials
                           └─> Success: returns { token, user }
                               └─> Redux: save user & token
                                   └─> localStorage: save token & user
                                       └─> navigate('/admin' or '/')
                                           └─> User logged in ✓

3. Subsequent API calls
   └─> apiClient request interceptor
       └─> Check token expiration
           ├─> Expired? → dispatch logout()
           └─> Valid? → Add "Authorization: Bearer {token}"
               └─> Send request with token
                   └─> Backend verifies token & role
                       └─> Success: return data
                       └─> Error: 401/403 → handleError in interceptor
*/

/**
 * ==========================================
 * COMPONENT HIERARCHY
 * ==========================================
 */

// APP.jsx (Root)
// └─ BrowserRouter
//    ├─ ToastContainer (NEW - for notifications)
//    ├─ Header
//    │  ├─ Logo/Brand
//    │  ├─ Navigation (role-based)
//    │  └─ Mobile Menu
//    │
//    ├─ Main Routes
//    │  ├─ Public Routes
//    │  │  ├─ HomePage
//    │  │  ├─ HotelsPage
//    │  │  ├─ HotelDetailsPage (NEW)
//    │  │  ├─ ChambresPage
//    │  │  ├─ LoginPage
//    │  │  └─ RegisterPage
//    │  │
//    │  ├─ Client Protected Routes (PrivateRoute)
//    │  │  ├─ ClientDashboard
//    │  │  ├─ UserProfile (NEW)
//    │  │  ├─ ReservationsPage
//    │  │  └─ FacturesPage
//    │  │
//    │  └─ Admin Protected Routes (PrivateRoute)
//    │     └─ AdminPage (6 tabs)
//    │        ├─ Dashboard (NEW)
//    │        ├─ Chambres
//    │        ├─ Services
//    │        ├─ Réservations
//    │        ├─ Facturation (NEW)
//    │        └─ Clients
//    │
//    └─ Footer

/**
 * ==========================================
 * STATE MANAGEMENT FLOW
 * ==========================================
 */

// Redux Store Structure:
/*
store
├─ state
│  ├─ auth
│  │  ├─ user
│  │  │  ├─ id
│  │  │  ├─ nom
│  │  │  ├─ email
│  │  │  └─ role (client | admin)
│  │  ├─ token (JWT string)
│  │  ├─ loading (boolean)
│  │  └─ error (string | null)
│  │
│  ├─ chambres
│  │  ├─ chambres (array of room objects)
│  │  ├─ loading (boolean)
│  │  └─ error (string | null)
│  │
│  └─ reservations
│     ├─ reservations (array of reservation objects)
│     ├─ loading (boolean)
│     └─ error (string | null)
│
└─ actions
   ├─ auth
   │  ├─ register({nom, email, password})
   │  ├─ login({email, password})
   │  ├─ logout()
   │  └─ clearError()
   │
   ├─ chambres
   │  ├─ fetchChambres()
   │  ├─ createChambre({...})
   │  ├─ updateChambre({...})
   │  └─ deleteChambre(id)
   │
   └─ reservations
      ├─ createReservation({...})
      ├─ fetchReservations()
      ├─ cancelReservation(id)
      └─ finishReservation(id)
*/

/**
 * ==========================================
 * AUTHENTICATION & SECURITY FLOW
 * ==========================================
 */

// LOGIN PROCESS:
/*
1. User at /login page
2. Enter email & password
3. Click "Connexion"
   ├─ Frontend: dispatch login action
   ├─ API: POST /api/auth/login
   ├─ Backend: Validate credentials
   ├─ Response: { token: "eyJ...", user: {...} }
   ├─ Redux: Set user & token in state
   ├─ Storage: Save to localStorage
   └─ Router: Navigate to / or /admin based on role

TOKEN VERIFICATION:
1. Frontend: Every API request
2. Check: Token expiration (decode JWT, check exp claim)
3. If expired:
   ├─ Dispatch logout action
   ├─ Clear Redux state
   ├─ Clear localStorage
   └─ Redirect to /login
4. If valid:
   ├─ Add "Authorization: Bearer {token}" header
   ├─ Send request
   └─ Handle response/error

PROTECTED ROUTES:
1. PrivateRoute component wraps protected pages
2. Check:
   ├─ user exists in Redux?
   ├─ token exists in localStorage?
   └─ user.role matches required role?
3. If all checks pass:
   └─ Render page
4. If any check fails:
   ├─ Redirect to /login (not authenticated)
   └─ Redirect to / (insufficient role)

ERROR HANDLING:
1. API returns 401 (Unauthorized)
   ├─ Dispatch logout action
   ├─ Clear token & user
   ├─ Redirect to /login
   └─ Show error message
2. API returns 403 (Forbidden)
   ├─ Redirect to /
   └─ Show error message
3. Other errors:
   ├─ Store error message in Redux
   └─ Show in component UI
*/

/**
 * ==========================================
 * DATA FLOW EXAMPLES
 * ==========================================
 */

// EXAMPLE 1: Create Reservation
/*
ChambresPage.jsx
│
└─ User clicks "Réserver"
   │
   ├─ Frontend validates dates
   │  └─ validateDateRange(arrival, departure)
   │
   ├─ API call: dispatch(createReservation({...}))
   │  │
   │  ├─ Redux loading = true
   │  │
   │  ├─ API POST /api/reservations
   │  │  │
   │  │  └─ Backend:
   │  │     ├─ Verify JWT token
   │  │     ├─ Verify user role (client)
   │  │     ├─ Validate dates
   │  │     ├─ Check room availability
   │  │     ├─ Create reservation record
   │  │     └─ Return { _id, ...reservation }
   │  │
   │  ├─ Redux loading = false
   │  ├─ Redux error = null
   │  ├─ Redux reservation saved
   │  │
   │  └─ notify.success('Réservation créée!')
   │
   └─ Navigate to /reservations
      └─ Show user's reservation with details
*/

// EXAMPLE 2: Admin Delete Room
/*
AdminPage.jsx (Chambres tab)
│
└─ Admin clicks delete button
   │
   ├─ Show confirmation dialog
   │  └─ window.confirm("Supprimer cette chambre?")
   │
   ├─ User clicks OK
   │  │
   │  ├─ API call: dispatch(deleteChambre(roomId))
   │  │  │
   │  │  ├─ Redux loading = true
   │  │  │
   │  │  ├─ API DELETE /api/admin/chambres/:id
   │  │  │  │
   │  │  │  └─ Backend:
   │  │  │     ├─ Verify JWT token
   │  │  │     ├─ Verify user role (admin)
   │  │  │     ├─ Delete room from DB
   │  │  │     └─ Return { success: true }
   │  │  │
   │  │  ├─ Redux loading = false
   │  │  ├─ Redux chambres array updated
   │  │  │
   │  │  └─ notify.success('Chambre supprimée')
   │  │
   │  └─ UI grid refreshed (room removed)
   │
   └─ Done
*/

/**
 * ==========================================
 * UTILITY INTEGRATION EXAMPLES
 * ==========================================
 */

// TOAST NOTIFICATIONS
/*
import notify from '@/utils/toast';

// Success
notify.success('Réservation créée!');

// Error
notify.error('Erreur: ' + error.message);

// Loading with update
const id = notify.loading('Création...');
notify.update(id, {
  render: 'Succès!',
  type: 'success',
  isLoading: false
});

// Warning
notify.warning('Vérifier les informations');

// Info
notify.info('Bienvenue!');
*/

// FORM VALIDATION
/*
import { validateForm, validateEmail, getFieldError } from '@/utils/validation';

// Validate single field
const emailError = validateEmail('invalid@');

// Validate entire form
const errors = validateForm(formData, 'login');

// Check if field has error
if (getFieldError(errors, 'email')) {
  // Show error
}

// Sanitize input
const sanitized = sanitizeForm(formData);
*/

export default "Visual Architecture Overview";
