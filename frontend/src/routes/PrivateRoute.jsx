import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, token } = useSelector(state => state.auth);
  const location = useLocation();

  // Vérifier si l'utilisateur est authentifié
  if (!user || !token) {
    // Rediriger vers la connexion en gardant le chemin d'accès actuel
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier le rôle requis
  if (requiredRole && user.role !== requiredRole) {
    // Rediriger vers la page d'accueil si le rôle ne correspond pas
    return <Navigate to="/" replace />;
  }

  // Route autorisée
  return children;
};

export default PrivateRoute;
