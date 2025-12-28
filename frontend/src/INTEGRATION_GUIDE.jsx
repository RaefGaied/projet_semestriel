/**
 * ========================================
 * INTEGRATION GUIDE: Toast & Validation
 * ========================================
 * 
 * This file shows how to use the new toast and validation utilities
 * throughout the application.
 */

// ==========================================
// 1. TOAST NOTIFICATION INTEGRATION
// ==========================================

/**
 * SETUP (Already Done):
 * - App.jsx has ToastContainer imported and configured
 * - src/utils/toast.js provides notify functions
 * 
 * USAGE IN COMPONENTS:
 */

// Example 1: Login Success
import notify from '@/utils/toast';
import { useDispatch } from 'react-redux';

function LoginPage() {
  const dispatch = useDispatch();

  const handleLogin = async (formData) => {
    try {
      const result = await dispatch(login(formData)).unwrap();
      notify.success('Connecté avec succès!'); // NEW
      navigate(result.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      notify.error(error.message || 'Erreur de connexion'); // NEW
    }
  };
}

// Example 2: Reservation Success
function ReservationForm() {
  const handleCreateReservation = async (data) => {
    const loadingToast = notify.loading('Création de réservation...');
    try {
      await reservationService.create(data);
      notify.update(loadingToast, {
        render: 'Réservation créée avec succès!',
        type: 'success',
        isLoading: false,
        autoClose: 3500
      });
    } catch (error) {
      notify.update(loadingToast, {
        render: error.message,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
    }
  };
}

// Example 3: Profile Update
function UserProfile() {
  const handleSaveProfile = async (formData) => {
    try {
      await userService.updateProfile(formData);
      notify.success('Profil mis à jour! ✨');
    } catch (error) {
      notify.error('Erreur: ' + error.message);
    }
  };
}

// Example 4: Admin Actions
function AdminPage() {
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Confirmer la suppression?')) return;
    
    try {
      await adminService.deleteRoom(roomId);
      notify.success('Chambre supprimée');
    } catch (error) {
      notify.error('Impossible de supprimer la chambre');
    }
  };

  const handleAddService = async (roomId, service) => {
    try {
      await adminService.addService(roomId, service);
      notify.success('Service ajouté!');
    } catch (error) {
      notify.error('Erreur lors de l\'ajout du service');
    }
  };
}

// ==========================================
// 2. FORM VALIDATION INTEGRATION
// ==========================================

/**
 * SETUP (Already Done):
 * - src/utils/validation.js provides validation functions
 * 
 * USAGE IN COMPONENTS:
 */

import {
  validateForm,
  validateEmail,
  getFieldError,
  hasErrors,
  sanitizeForm
} from '@/utils/validation';

// Example 1: Enhanced Login Form
function EnhancedLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (name === 'email') {
      const error = validateEmail(value);
      setFieldErrors(prev => ({
        ...prev,
        email: error || undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate entire form
    const errors = validateForm(formData, 'login');
    
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      notify.warning('Veuillez corriger les erreurs');
      return;
    }

    // Sanitize and submit
    const sanitized = sanitizeForm(formData);
    dispatch(login(sanitized));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        {fieldErrors.email && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          className="w-full px-4 py-2 border rounded"
        />
        {fieldErrors.password && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={hasErrors(fieldErrors) || loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Connexion
      </button>
    </form>
  );
}

// Example 2: Enhanced Register Form
function EnhancedRegisterPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleValidateField = (name, value) => {
    const schema = {
      nom: () => validateName(value),
      email: () => validateEmail(value),
      password: () => validatePassword(value, 8),
      passwordConfirm: () => validatePasswordConfirm(formData.password, value)
    };

    const validator = schema[name];
    if (validator) {
      const error = validator();
      setFieldErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    handleValidateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm(formData, 'register');
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      notify.warning('Veuillez corriger les erreurs');
      return;
    }

    const sanitized = sanitizeForm(formData);
    dispatch(register(sanitized));
  };

  const isFormValid = !hasErrors(fieldErrors) && 
    formData.nom && formData.email && 
    formData.password && formData.passwordConfirm;

  return (
    <form onSubmit={handleSubmit}>
      {/* Nom Field */}
      <div className="mb-4">
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom complet"
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.nom ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.nom && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.nom}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.email && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe (min 8 caractères)"
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.password && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
        )}
      </div>

      {/* Password Confirmation Field */}
      <div className="mb-4">
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="Confirmer le mot de passe"
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.passwordConfirm && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.passwordConfirm}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        S'inscrire
      </button>
    </form>
  );
}

// Example 3: Room Creation Form (Admin)
function AdminRoomForm() {
  const [formData, setFormData] = useState({
    numero: '',
    type: 'SIMPLE',
    capacite: '',
    prix: '',
    statut: 'DISPONIBLE'
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate field
    const validators = {
      numero: () => validateRequired(value, 'Numéro'),
      type: () => validateSelect(value, 'Type'),
      capacite: () => validateNumber(value, 'Capacité', 1, 10),
      prix: () => validatePrice(value)
    };

    if (validators[name]) {
      const error = validators[name]();
      setFieldErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formData, 'chambre');
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      notify.warning('Veuillez corriger les erreurs');
      return;
    }

    try {
      const sanitized = sanitizeForm(formData);
      await adminService.createRoom(sanitized);
      notify.success('Chambre créée avec succès!');
      // Reset form
      setFormData({ numero: '', type: 'SIMPLE', capacite: '', prix: '', statut: 'DISPONIBLE' });
    } catch (error) {
      notify.error('Erreur: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Numéro de chambre</label>
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.numero ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.numero && <p className="text-red-600 text-sm">{fieldErrors.numero}</p>}
      </div>

      <div>
        <label className="block mb-2">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="SIMPLE">Simple</option>
          <option value="DOUBLE">Double</option>
          <option value="SUITE">Suite</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Capacité</label>
        <input
          type="number"
          name="capacite"
          value={formData.capacite}
          onChange={handleChange}
          min="1"
          max="10"
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.capacite ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.capacite && <p className="text-red-600 text-sm">{fieldErrors.capacite}</p>}
      </div>

      <div>
        <label className="block mb-2">Prix (MAD)</label>
        <input
          type="number"
          name="prix"
          value={formData.prix}
          onChange={handleChange}
          step="0.01"
          min="0"
          className={`w-full px-4 py-2 border rounded ${
            fieldErrors.prix ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.prix && <p className="text-red-600 text-sm">{fieldErrors.prix}</p>}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter Chambre
      </button>
    </form>
  );
}

// ==========================================
// 3. API INTEGRATION WITH TOAST
// ==========================================

/**
 * Example: Create Reservation with Toast Notifications
 */
function ReservationFlow() {
  const handleBookRoom = async (roomId, arrivalDate, departureDate) => {
    // Validate dates
    const dateError = validateDateRange(arrivalDate, departureDate);
    if (dateError) {
      notify.error(dateError);
      return;
    }

    // Show loading toast
    const toastId = notify.loading('Traitement de votre réservation...');

    try {
      const result = await dispatch(createReservation({
        chambreId: roomId,
        dateArrivee: arrivalDate,
        dateDepart: departureDate
      })).unwrap();

      // Update toast to success
      notify.update(toastId, {
        render: 'Réservation confirmée! Numéro: ' + result.reservationId,
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      // Navigate after 1 second
      setTimeout(() => navigate('/reservations'), 1000);
    } catch (error) {
      // Update toast to error
      notify.update(toastId, {
        render: 'Erreur: ' + (error.message || 'Réservation échouée'),
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
    }
  };
}

// ==========================================
// 4. COMMON PATTERNS
// ==========================================

/**
 * Pattern 1: Form with Real-time Validation
 */
const FormWithValidation = {
  state: { formData: {}, fieldErrors: {} },
  handleChange: (name, value) => {
    // Update form data
    // Validate field
    // Update field errors
  },
  handleSubmit: (e) => {
    e.preventDefault();
    // Validate full form
    // Show errors if any
    // Submit if valid
    // Show success/error toast
  }
};

/**
 * Pattern 2: API Call with Toast
 */
const ApiCallWithToast = async (apiFunction, loadingMsg, successMsg, errorMsg) => {
  const toastId = notify.loading(loadingMsg);
  try {
    const result = await apiFunction();
    notify.update(toastId, {
      render: successMsg,
      type: 'success',
      isLoading: false,
      autoClose: 3500
    });
    return result;
  } catch (error) {
    notify.update(toastId, {
      render: errorMsg + ': ' + error.message,
      type: 'error',
      isLoading: false,
      autoClose: 4000
    });
    throw error;
  }
};

/**
 * Pattern 3: Confirmation Dialog + Toast
 */
const ConfirmAndExecute = async (message, confirmText, apiFunction, successMsg) => {
  if (window.confirm(message)) {
    const toastId = notify.loading('Traitement...');
    try {
      const result = await apiFunction();
      notify.update(toastId, {
        render: successMsg,
        type: 'success',
        isLoading: false
      });
      return result;
    } catch (error) {
      notify.update(toastId, {
        render: 'Erreur: ' + error.message,
        type: 'error',
        isLoading: false
      });
      throw error;
    }
  }
};

export default "Integration Guide for Toast and Validation";
