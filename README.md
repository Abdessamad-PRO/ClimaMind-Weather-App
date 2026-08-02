#  ClimaMind — Modern Weather Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20-red?style=for-the-badge&logo=angular" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Leaflet-GIS-green?style=for-the-badge&logo=leaflet" />
  <img src="https://img.shields.io/badge/OpenWeather-API-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Responsive-Desktop%20%7C%20Tablet%20%7C%20Mobile-success?style=for-the-badge" />
</p>

<p align="center">
A modern, elegant, and fully responsive weather dashboard built with Angular, providing real-time weather information, interactive forecasts, dynamic animations, and a GIS-powered world map.
</p>

---

#  Demo Video

Watch ClimaMind in action.



https://github.com/user-attachments/assets/9327c29d-17b5-44df-893b-182dac8e3587



---

#  Features

##  Real-Time Weather

- Current temperature
- Feels Like temperature
- Weather condition
- Humidity
- Wind speed
- Atmospheric pressure
- Visibility
- Sunrise & Sunset
- Daily High / Low temperature

---

##  Hourly Forecast

- Interactive 24-hour weather timeline
- Dynamic weather icons
- Day/Night aware visualization
- Smooth horizontal scrolling

---

##  Interactive GIS Map

Built using **Leaflet.js**

Features include:

- Click anywhere on Earth to retrieve weather
- Automatic reverse geocoding
- Infinite world scrolling
- Multiple map styles

Available layers:

- OpenStreetMap
- Topographic
- Satellite

---

##  Location Services

- Automatic geolocation on startup
- Search any city worldwide
- Instant weather refresh

---

##  Dynamic Background

The interface changes according to:

- ☀️ Clear Sky
- ☁️ Clouds
- 🌧️ Rain
- ❄️ Snow
- 🌩️ Storm
- 🌙 Day/Night cycle

Animated backgrounds are rendered using CSS animations.

---

##  Unit Conversion

Switch instantly between:

- Celsius (°C)
- Fahrenheit (°F)

---

##  Fully Responsive

Optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

Using:

- CSS Grid
- Flexbox
- Responsive Breakpoints

---

# 🛠️ Technologies

## Frontend

- Angular
- TypeScript
- HTML5
- SCSS / CSS3
- RxJS

## APIs

- OpenWeather API

## Maps

- Leaflet.js
- OpenStreetMap

---

#  Requirements

Install the following before running the project.

| Software | Version |
|-----------|----------|
| Node.js | v18+ |
| npm | v9+ |
| Angular CLI | v17+ |
| Git | Latest |

---

#  Installation

Clone the repository

```bash
git clone https://github.com/Abdessamad-PRO/ClimaMind-Weather-App.git
```

Go inside the project

```bash
cd climamind-app
```

Install dependencies

```bash
npm install
```

---

#  Environment Configuration

Update:

```text
src/environments/environment.ts
```

```typescript
export const environment = {
  production: false,
  weatherApiKey: 'YOUR_OPENWEATHER_API_KEY'
};
```

Replace

```text
YOUR_OPENWEATHER_API_KEY
```

with your personal API key.

---

#  Run the Project

```bash
ng serve
```

Open

```text
http://localhost:4200
```

---

#  Project Structure

```text
src/
│
├── app/
│   │
│   ├── components/
│   │   ├── air-quality/
│   │   │   ├── air-quality.component.ts
│   │   │   ├── air-quality.component.html
│   │   │   └── air-quality.component.scss
│   │   │
│   │   ├── background-anim/
│   │   │   ├── background-anim.component.ts
│   │   │   ├── background-anim.component.html
│   │   │   └── background-anim.component.scss
│   │   │
│   │   ├── current-weather/
│   │   │   ├── current-weather.component.ts
│   │   │   ├── current-weather.component.html
│   │   │   └── current-weather.component.scss
│   │   │
│   │   ├── forecast-wave/
│   │   │   ├── forecast-wave.component.ts
│   │   │   ├── forecast-wave.component.html
│   │   │   └── forecast-wave.component.scss
│   │   │
│   │   ├── header-actions/
│   │   │   ├── header-actions.component.ts
│   │   │   ├── header-actions.component.html
│   │   │   └── header-actions.component.scss
│   │   │
│   │   ├── indicator-cards/
│   │   │   ├── indicator-cards.component.ts
│   │   │   ├── indicator-cards.component.html
│   │   │   └── indicator-cards.component.scss
│   │   │
│   │   ├── recent-searches/
│   │   │   ├── recent-searches.component.ts
│   │   │   ├── recent-searches.component.html
│   │   │   └── recent-searches.component.scss
│   │   │
│   │   ├── sidebar/
│   │   │   ├── sidebar.component.ts
│   │   │   ├── sidebar.component.html
│   │   │   └── sidebar.component.scss
│   │   │
│   │   └── world-map/
│   │       ├── world-map.component.ts
│   │       ├── world-map.component.html
│   │       └── world-map.component.scss
│   │
│   ├── core/
│   │   ├── models/
│   │   │   ├── location.model.ts
│   │   │   └── weather.model.ts
│   │   │
│   │   └── services/
│   │       ├── location.service.ts
│   │       ├── map.service.ts
│   │       └── weather.service.ts
│   │
│   ├── pages/
│   │   └── dashboard/
│   │       ├── dashboard.component.ts
│   │       ├── dashboard.component.html
│   │       └── dashboard.component.scss
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.config.ts
│   └── app.routes.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
│
├── index.html
├── main.ts
└── styles.scss
```

---

#  Weather Data

The application displays

- Current Weather
- Hourly Forecast
- Temperature
- Wind
- Pressure
- Humidity
- Visibility
- Sunrise
- Sunset
- Coordinates

---

#  GIS Features

✔ Click on any location

✔ Weather updates instantly

✔ Reverse geocoding

✔ Multiple map layers

✔ Infinite map scrolling

✔ Responsive map controls

---

#  UI Highlights

- Glassmorphism
- Soft shadows
- Smooth animations
- Weather-based backgrounds
- Responsive cards
- Animated icons
- Modern gradients

---

#  Roadmap

Upcoming features:

- [ ] Weather Radar Layers
- [ ] Favorite Cities
- [ ] Weather Notifications
- [ ] Progressive Web App (PWA)
- [ ] Dark Mode
- [ ] Weather History
- [ ] Charts & Statistics

---

#  Future Improvements

- AI Weather Assistant
- Weather Chatbot
- Voice Search
- Smart Recommendations
- Weather Widgets
- Calendar Integration
- Travel Weather Planner

---

#  Author

**AIT EL MAHJOUB ABDESSAMAD**

Master's Student in Distributed Systems & Artificial Intelligence

Passionate about:

- Artificial Intelligence
- Machine Learning
- Full Stack Development
- GIS Applications
- Modern Web Technologies

GitHub:

https://github.com/Abdessamad-PRO

LinkedIn:

https://www.linkedin.com/feed/
