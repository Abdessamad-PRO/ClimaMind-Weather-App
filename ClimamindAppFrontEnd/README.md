# WeatherVue — Angular Weather Application

Application météo cinématique avec animations dynamiques, carte mondiale interactive et détection de localisation automatique.

---

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration API

**Étape obligatoire** : Obtenir une clé API OpenWeatherMap gratuite :

1. Créer un compte sur [openweathermap.org](https://openweathermap.org/api)
2. S'abonner au plan **"Current Weather Data"** (gratuit) + **"5 Day / 3 Hour Forecast"** + **"Air Pollution API"**
3. Copier votre API key
4. Ouvrir `src/app/core/services/weather.service.ts`
5. Remplacer `'YOUR_OPENWEATHERMAP_API_KEY'` par votre clé

```typescript
private readonly API_KEY = 'votre_clé_ici';
```

> ⚠️ La clé peut prendre jusqu'à 2h après activation pour fonctionner.

## 🏃 Démarrage

```bash
ng serve
```

Ouvrir [http://localhost:4200](http://localhost:4200)

## 🗂️ Structure du projet

```
src/app/
├── core/
│   ├── models/
│   │   ├── weather.model.ts      # Interfaces WeatherData, ForecastDay, AirQuality
│   │   └── location.model.ts     # Interfaces LocationData, RecentSearch, MapPin
│   └── services/
│       ├── weather.service.ts    # Appels OpenWeatherMap API
│       ├── location.service.ts   # Géolocalisation navigateur
│       └── map.service.ts        # Gestion des pins sur la carte
├── components/
│   ├── background-anim/          # Animations canvas (pluie, neige, soleil, orage...)
│   ├── sidebar/                  # Barre latérale (carte, recherches récentes, qualité air)
│   ├── air-quality/              # Widget qualité de l'air AQI
│   ├── world-map/               # SVG carte mondiale cliquable
│   ├── header-actions/           # Barre de recherche + actions
│   ├── current-weather/          # Température + stats courantes
│   ├── recent-searches/          # Historique des villes recherchées
│   └── forecast-wave/            # Prévisions 6 jours avec courbe SVG
└── pages/
    └── dashboard/                # Page principale orchestrant tout
```

## ✨ Fonctionnalités

- **Détection automatique** de la position GPS au chargement
- **Fond animé** dynamique selon la météo :
  - ☀️ Soleil avec rayons en mouvement
  - 🌧️ Pluie animée (canvas particles)
  - ❄️ Neige flottante
  - ⛈️ Orage avec éclairs aléatoires
  - ☁️ Nuages défilants
  - 🌫️ Brume
- **Carte mondiale SVG** cliquable pour obtenir la météo de n'importe quel point
- **Recherche de villes** avec autocomplétion
- **Prévisions 6 jours** avec courbe de température animée
- **Qualité de l'air** : AQI, PM2.5, PM10, O₃, NO₂
- **Historique** des recherches récentes (persisté en localStorage)
- **Lever/coucher du soleil**

##  Design

- Palette sombre cinématique (inspirée du design fourni)
- Glassmorphism sur les cards
- Typographie Inter
- Transitions fluides sur changement de météo
