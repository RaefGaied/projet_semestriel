import { LogOut, Menu, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice"
import { useState } from "react"

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-75 transition">
          <span className="text-2xl font-bold text-blue-600">🏨</span>
          <span className="text-xl font-bold text-gray-800">HôtelApp</span>
        </Link>

        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Accueil
          </Link>
          <Link to="/hotels" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Hôtels
          </Link>
          <Link to="/chambres" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Chambres
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Admin
                </Link>
              )}
              {user.role === "client" && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    to="/reservations"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Réservations
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium flex items-center space-x-1"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 p-4 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2">
            Accueil
          </Link>
          <Link to="/hotels" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2">
            Hôtels
          </Link>
          <Link to="/chambres" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2">
            Chambres
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2">
                  Admin
                </Link>
              )}
              {user.role === "client" && (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-blue-600 transition font-medium py-2"
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    to="/reservations"
                    className="block text-gray-700 hover:text-blue-600 transition font-medium py-2"
                  >
                    Réservations
                  </Link>
                  <Link
                    to="/factures"
                    className="block text-gray-700 hover:text-blue-600 transition font-medium py-2"
                  >
                    Factures
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center space-x-1 mt-2"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2">
                Connexion
              </Link>
              <Link
                to="/register"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium text-center"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
