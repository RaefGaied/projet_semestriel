const mongoose = require('mongoose');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Chambre = require('./models/Chambre');
const Service = require('./models/Service');
const Reservation = require('./models/Reservation');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Chambre.deleteMany({});
    await Service.deleteMany({});
    await Reservation.deleteMany({});
    console.log('🗑️  Base de données nettoyée');
  } catch (err) {
    console.error('❌ Erreur lors du nettoyage:', err.message);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    // Créer un admin (le password sera hashé automatiquement par le hook pre-save)
    const admin = await User.create({
      nom: 'Admin',
      email: 'admin@hotel.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin créé: admin@hotel.com / admin123');

    // Créer quelques clients (insertMany ne déclenche pas les hooks, donc on utilise create)
    const clients = [];
    const clientsData = [
      {
        nom: 'Dupont',
        email: 'marie.dupont@email.com',
        password: 'client123',
        role: 'client'
      },
      {
        nom: 'Martin',
        email: 'pierre.martin@email.com',
        password: 'client123',
        role: 'client'
      },
      {
        nom: 'Bernard',
        email: 'sophie.bernard@email.com',
        password: 'client123',
        role: 'client'
      }
    ];

    for (const clientData of clientsData) {
      const client = await User.create(clientData);
      clients.push(client);
    }
    console.log('✅ 3 clients créés (mot de passe: client123)');

    // Données des hôtels réels
    const hotelsData = [
      {
        nom: 'Grand Hôtel du Palais',
        adresse: '1 Avenue de l\'Impératrice',
        ville: 'Biarritz',
        telephone: '+33 5 59 41 64 00',
        email: 'contact@hotel-du-palais.com',
        etoiles: 5,
        description: 'Palace historique face à l\'océan, ancien palais impérial offrant un luxe intemporel avec spa, piscine et restaurants gastronomiques.'
      },
      {
        nom: 'Hôtel Plaza Athénée',
        adresse: '25 Avenue Montaigne',
        ville: 'Paris',
        telephone: '+33 1 53 67 66 65',
        email: 'reservation@plaza-athenee-paris.com',
        etoiles: 5,
        description: 'Hôtel de luxe parisien sur la prestigieuse avenue Montaigne, restaurant étoilé Alain Ducasse, spa Dior et suites avec vue sur la Tour Eiffel.'
      },
      {
        nom: 'Le Meurice',
        adresse: '228 Rue de Rivoli',
        ville: 'Paris',
        telephone: '+33 1 44 58 10 10',
        email: 'reservations@lemeurice.com',
        etoiles: 5,
        description: 'Palace parisien raffiné face au jardin des Tuileries, restaurant gastronomique Alain Ducasse 2 étoiles Michelin et spa Valmont.'
      },
      {
        nom: 'Hôtel Martinez',
        adresse: '73 Boulevard de la Croisette',
        ville: 'Cannes',
        telephone: '+33 4 93 90 12 34',
        email: 'info@hotel-martinez.com',
        etoiles: 5,
        description: 'Palace Art Déco sur la Croisette, plage privée, restaurant 2 étoiles Michelin La Palme d\'Or et suites avec vue mer panoramique.'
      },
      {
        nom: 'Hôtel Le Bristol',
        adresse: '112 Rue du Faubourg Saint-Honoré',
        ville: 'Paris',
        telephone: '+33 1 53 43 43 00',
        email: 'resa@lebristolparis.com',
        etoiles: 5,
        description: 'Palace parisien d\'exception avec jardin à la française, restaurant 3 étoiles Michelin Epicure, spa et piscine sur les toits.'
      },
      {
        nom: 'Hôtel de Crillon',
        adresse: '10 Place de la Concorde',
        ville: 'Paris',
        telephone: '+33 1 44 71 15 00',
        email: 'reservations@crillon.com',
        etoiles: 5,
        description: 'Palace historique du XVIIIe siècle place de la Concorde, décor classique français, spa Sense et bars iconiques.'
      },
      {
        nom: 'La Réserve Paris',
        adresse: '42 Avenue Gabriel',
        ville: 'Paris',
        telephone: '+33 1 58 36 60 60',
        email: 'contact@lareserve-paris.com',
        etoiles: 5,
        description: 'Hôtel-particulier de luxe près des Champs-Élysées, ambiance intime, restaurant gastronomique et spa exclusif.'
      },
      {
        nom: 'Hôtel du Cap-Eden-Roc',
        adresse: 'Boulevard J. F. Kennedy',
        ville: 'Antibes',
        telephone: '+33 4 93 61 39 01',
        email: 'info@hotel-du-cap-eden-roc.com',
        etoiles: 5,
        description: 'Palace mythique sur la Côte d\'Azur, piscine à débordement taillée dans la roche, restaurant gastronomique et plage privée.'
      },
      {
        nom: 'Les Airelles Courchevel',
        adresse: 'Rue du Jardin Alpin',
        ville: 'Courchevel',
        telephone: '+33 4 79 00 38 38',
        email: 'reservation@airelles.com',
        etoiles: 5,
        description: 'Palace alpin de luxe au cœur de Courchevel 1850, décor autrichien, spa Valmont et accès direct aux pistes de ski.'
      },
      {
        nom: 'Royal Riviera',
        adresse: '3 Avenue Jean Monnet',
        ville: 'Saint-Jean-Cap-Ferrat',
        telephone: '+33 4 93 76 31 00',
        email: 'info@royal-riviera.com',
        etoiles: 5,
        description: 'Hôtel élégant sur la presqu\'île de Saint-Jean-Cap-Ferrat, plage privée, jardin méditerranéen et vue sur la baie de Beaulieu.'
      }
    ];

    const hotels = [];
    for (const hotelData of hotelsData) {
      const hotel = await Hotel.create({
        ...hotelData,
        admin: admin._id,
        services: []
      });
      hotels.push(hotel);
      console.log(`✅ Hôtel créé: ${hotel.nom} - ${hotel.ville}`);
    }

    // Services standard pour chaque hôtel
    const servicesTypes = [
      { nom: 'Petit-déjeuner continental', description: 'Buffet petit-déjeuner avec viennoiseries, jus de fruits frais et boissons chaudes', prix: 25 },
      { nom: 'Petit-déjeuner en chambre', description: 'Service en chambre de votre petit-déjeuner continental', prix: 35 },
      { nom: 'Accès Spa & Wellness', description: 'Accès illimité au spa, hammam, sauna et salle de fitness', prix: 45 },
      { nom: 'Massage relaxant 60min', description: 'Massage relaxant aux huiles essentielles par un praticien qualifié', prix: 95 },
      { nom: 'Parking privé couvert', description: 'Place de parking sécurisée dans garage souterrain', prix: 30 },
      { nom: 'Service voiturier', description: 'Prise en charge et stationnement de votre véhicule 24h/24', prix: 40 },
      { nom: 'Transfert aéroport', description: 'Navette privée depuis/vers l\'aéroport en berline de luxe', prix: 120 },
      { nom: 'Room service 24h', description: 'Service en chambre disponible 24h/24 avec menu complet', prix: 15 },
      { nom: 'Champagne & amuse-bouches', description: 'Bouteille de champagne et sélection de mets raffinés en chambre', prix: 85 },
      { nom: 'Dîner gastronomique', description: 'Menu dégustation 5 plats au restaurant de l\'hôtel', prix: 150 },
      { nom: 'Excursion privée guidée', description: 'Visite guidée privée de la région avec chauffeur', prix: 200 },
      { nom: 'Location vélo électrique', description: 'Location de vélo électrique pour la journée', prix: 35 },
      { nom: 'Cours de yoga privé', description: 'Séance de yoga personnalisée avec instructeur certifié', prix: 75 },
      { nom: 'Baby-sitting', description: 'Service de garde d\'enfants par professionnels qualifiés (par heure)', prix: 25 },
      { nom: 'Bouquet de fleurs', description: 'Bouquet de fleurs fraîches en chambre', prix: 50 }
    ];

    // Créer des services pour chaque hôtel (sélection aléatoire)
    for (const hotel of hotels) {
      const nombreServices = Math.floor(Math.random() * 5) + 8; // Entre 8 et 12 services
      const servicesHotel = [];
      
      // Mélanger les services et en prendre un certain nombre
      const shuffled = [...servicesTypes].sort(() => 0.5 - Math.random());
      const selectedServices = shuffled.slice(0, nombreServices);
      
      for (const serviceType of selectedServices) {
        // Varier légèrement les prix selon l'hôtel
        const variationPrix = 1 + (Math.random() * 0.3 - 0.15); // ±15%
        const prixAjuste = Math.round(serviceType.prix * variationPrix);
        
        const service = await Service.create({
          hotel: hotel._id,
          nom: serviceType.nom,
          description: serviceType.description,
          prix: prixAjuste,
          actif: Math.random() > 0.1 // 90% des services sont actifs
        });
        
        servicesHotel.push(service._id);
      }
      
      // Mettre à jour l'hôtel avec ses services
      hotel.services = servicesHotel;
      await hotel.save();
      
      console.log(`✅ ${servicesHotel.length} services créés pour ${hotel.nom}`);
    }

    // Types de chambres avec descriptions
    const typesChambres = [
      {
        type: 'SIMPLE',
        capacite: 1,
        descriptions: [
          'Chambre Simple élégante avec lit queen size et vue sur jardin',
          'Chambre Simple confortable avec bureau et coin détente',
          'Chambre Simple raffinée avec salle de bain en marbre'
        ],
        vues: ['jardin', 'ville', 'cour intérieure'],
        prixBase: 150
      },
      {
        type: 'DOUBLE',
        capacite: 2,
        descriptions: [
          'Chambre Double spacieuse avec balcon privé',
          'Chambre Double luxueuse avec baignoire sur pieds',
          'Chambre Double contemporaine avec dressing'
        ],
        vues: ['jardin', 'ville', 'mer', 'montagne'],
        prixBase: 250
      },
      {
        type: 'SUITE',
        capacite: 3,
        descriptions: [
          'Suite Junior avec salon séparé et terrasse panoramique',
          'Suite Prestige avec cheminée et vue imprenable',
          'Suite Familiale avec deux chambres et kitchenette'
        ],
        vues: ['mer', 'montagne', 'panoramique', 'ville'],
        prixBase: 450
      },
      {
        type: 'DELUXE',
        capacite: 4,
        descriptions: [
          'Suite Deluxe avec jacuzzi privatif et terrasse XXL',
          'Suite Deluxe Penthouse avec rooftop privé',
          'Suite Royale avec salon, chambre et salle de réception'
        ],
        vues: ['mer', 'panoramique', 'montagne'],
        prixBase: 800
      }
    ];

    // Créer des chambres pour chaque hôtel
    let totalChambres = 0;
    for (const hotel of hotels) {
      const nombreChambres = Math.floor(Math.random() * 15) + 20; // Entre 20 et 34 chambres
      
      for (let i = 1; i <= nombreChambres; i++) {
        // Répartition: 40% Simple, 35% Double, 20% Suite, 5% Deluxe
        let typeInfo;
        const rand = Math.random();
        if (rand < 0.40) {
          typeInfo = typesChambres[0]; // SIMPLE
        } else if (rand < 0.75) {
          typeInfo = typesChambres[1]; // DOUBLE
        } else if (rand < 0.95) {
          typeInfo = typesChambres[2]; // SUITE
        } else {
          typeInfo = typesChambres[3]; // DELUXE
        }
        
        // Prix variable selon l'hôtel (5 étoiles = prix plus élevé)
        const multiplicateur = hotel.etoiles === 5 ? 1.5 : 1.2;
        const variationPrix = 0.9 + Math.random() * 0.2; // ±10%
        const prix = Math.round(typeInfo.prixBase * multiplicateur * variationPrix);
        
        // Sélectionner une vue aléatoire appropriée
        const vue = typeInfo.vues[Math.floor(Math.random() * typeInfo.vues.length)];
        
        // Numéro de chambre (étage + numéro)
        const etage = Math.floor(i / 10) + 1;
        const numero = String(etage) + String(i % 10 || 10).padStart(2, '0');
        
        // Statut: 80% disponibles, 15% occupées, 5% maintenance
        let statut = 'DISPONIBLE';
        const randStatut = Math.random();
        if (randStatut > 0.95) {
          statut = 'MAINTENANCE';
        } else if (randStatut > 0.80) {
          statut = 'OCCUPEE';
        }
        
        await Chambre.create({
          numero,
          type: typeInfo.type,
          capacite: typeInfo.capacite,
          prix,
          vue,
          statut,
          hotel: hotel._id
        });
        
        totalChambres++;
      }
      
      console.log(`✅ ${nombreChambres} chambres créées pour ${hotel.nom}`);
    }

    // Créer des réservations pour tester
    console.log('\n📅 Création des réservations de test...');
    const toutes_les_chambres = await Chambre.find().populate('hotel');
    const reservations = [];
    
    // Créer 15-20 réservations avec différents statuts
    const nombreReservations = Math.floor(Math.random() * 6) + 15; // 15-20 réservations
    
    for (let i = 0; i < nombreReservations; i++) {
      // Choisir un client aléatoire
      const client = clients[Math.floor(Math.random() * clients.length)];
      
      // Choisir une chambre disponible aléatoire
      const chambre = toutes_les_chambres[Math.floor(Math.random() * toutes_les_chambres.length)];
      
      // Générer des dates aléatoires (dans le passé, présent ou futur)
      const baseDate = new Date();
      const offsetJours = Math.floor(Math.random() * 60) - 30; // -30 à +30 jours
      const datedebut = new Date(baseDate);
      datedebut.setDate(baseDate.getDate() + offsetJours);
      
      const duree = Math.floor(Math.random() * 7) + 2; // 2-8 nuits
      const datefin = new Date(datedebut);
      datefin.setDate(datedebut.getDate() + duree);
      
      // Choisir des services aléatoires de l'hôtel
      const servicesHotel = await Service.find({ hotel: chambre.hotel._id, actif: true });
      const nombreServices = Math.floor(Math.random() * Math.min(4, servicesHotel.length)); // 0-3 services
      const servicesSelectionnes = [];
      
      for (let j = 0; j < nombreServices; j++) {
        const serviceRandom = servicesHotel[Math.floor(Math.random() * servicesHotel.length)];
        if (!servicesSelectionnes.includes(serviceRandom._id)) {
          servicesSelectionnes.push(serviceRandom._id);
        }
      }
      
      // Déterminer le statut selon les dates
      let statut;
      const maintenant = new Date();
      const rand = Math.random();
      
      if (datefin < maintenant) {
        // Réservation passée
        statut = rand > 0.2 ? 'TERMINEE' : 'ANNULEE';
      } else if (datedebut > maintenant) {
        // Réservation future
        if (rand < 0.15) {
          statut = 'EN_ATTENTE';
        } else if (rand < 0.85) {
          statut = 'VALIDEE';
        } else {
          statut = 'ANNULEE';
        }
      } else {
        // Réservation en cours
        statut = rand > 0.1 ? 'VALIDEE' : 'ANNULEE';
      }
      
      const reservation = await Reservation.create({
        client: client._id,
        chambre: chambre._id,
        datedebut,
        datefin,
        services: servicesSelectionnes,
        statut
      });
      
      reservations.push(reservation);
      
      // Mettre à jour le statut de la chambre si nécessaire
      if (statut === 'VALIDEE' && datedebut <= maintenant && datefin >= maintenant) {
        chambre.statut = 'OCCUPEE';
        await chambre.save();
      }
    }
    
    console.log(`✅ ${reservations.length} réservations créées`);

    console.log('\n🎉 ==========================================');
    console.log('🎉 BASE DE DONNÉES REMPLIE AVEC SUCCÈS !');
    console.log('🎉 ==========================================\n');
    console.log(`📊 Statistiques:`);
    console.log(`   - ${hotels.length} hôtels créés`);
    console.log(`   - ${totalChambres} chambres créées`);
    console.log(`   - ${await Service.countDocuments()} services créés`);
    console.log(`   - ${reservations.length} réservations créées`);
    console.log(`   - ${clients.length + 1} utilisateurs créés\n`);
    console.log(`🔐 Comptes de test:`);
    console.log(`   Admin: admin@hotel.com / admin123`);
    console.log(`   Client: marie.dupont@email.com / client123`);
    console.log(`   Client: pierre.martin@email.com / client123`);
    console.log(`   Client: sophie.bernard@email.com / client123\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seeding:', err.message);
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
