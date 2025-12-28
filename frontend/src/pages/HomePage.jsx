import { Link } from 'react-router-dom';
import { Building2, Lock, Clock, Users, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Subtle and Professional */}
      <section className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Trouvez votre chambre d'hôtel idéale
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Découvrez des centaines de chambres d'hôtel de qualité. Réservez en quelques clics, simplement et en toute sécurité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/chambres"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Voir les chambres <ArrowRight size={20} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition border-2 border-white"
              >
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Pourquoi choisir HôtelApp ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Large Sélection</h3>
              <p className="text-gray-600">
                Plus de 1000 chambres disponibles dans différentes catégories et à tous les prix.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sécurisé & Fiable</h3>
              <p className="text-gray-600">
                Vos données et paiements sont protégés avec les meilleures normes de sécurité.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support 24/7</h3>
              <p className="text-gray-600">
                Notre équipe est toujours disponible pour vous aider à toute heure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Professional */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">1000+</div>
              <p className="text-gray-600 text-lg">Chambres disponibles</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">10K+</div>
              <p className="text-gray-600 text-lg">Clients satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600 text-lg">Partenaires hôteliers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Inviting */}
      <section className="bg-linear-to-r from-blue-50 to-indigo-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">
            Prêt à réserver ?
          </h2>
          <p className="text-xl text-gray-600">
            Créez votre compte en quelques secondes et trouvez votre chambre idéale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              S'inscrire maintenant <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}