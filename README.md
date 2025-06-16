# Weather Dashboard

A beautiful, responsive weather application built with Next.js, TypeScript, and Tailwind CSS that provides current weather conditions, forecasts, and historical weather data.

![Weather Dashboard Screenshot](https://github.com/RandilaP/weather-dashboard/blob/main/public/screenshot.png?raw=true)

## Features

- **Current Weather Conditions:** View real-time weather data including temperature, humidity, wind speed, and UV index
- **3-Day Forecast:** See upcoming weather conditions for the next three days
- **7-Day History:** Review weather patterns from the past week
- **Location Search:** Look up weather for any city worldwide
- **Current Location Detection:** Get weather data for your exact location
- **Saved Locations:** Save your favorite locations for quick access
- **Dynamic Backgrounds:** Background images change based on current weather conditions
- **Responsive Design:** Works beautifully on mobile, tablet, and desktop devices
- **Dark Mode Support:** Optimized for viewing in low-light environments

## Technologies Used

- **Next.js** - React framework for server-side rendering and static generation
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For utility-first styling
- **Lucide React** - For beautiful, consistent icons
- **date-fns** - For date manipulation and formatting
- **WeatherAPI** - For accurate weather data
- **Axios** - For API requests
- **localStorage** - For persisting saved locations

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RandilaP/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a .env.local file in the project root and add your WeatherAPI key:
   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

```
weather-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── forecastTable.tsx
│   │   ├── historyTable.tsx
│   │   ├── locationSwitcher.tsx
│   │   ├── savedLocations.tsx
│   │   ├── searchBar.tsx
│   │   ├── weatherBackground.tsx
│   │   ├── weatherCard.tsx
│   │   └── weatherTabs.tsx
│   └── types/
│       └── weatherData.ts
├── public/
│   ├── fog.png
│   ├── night.png
│   ├── partly-cloudy.png
│   ├── rainy.png
│   ├── snowy.png
│   ├── stormy.png
│   └── sunny.png
├── .env.local
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Component Structure

The application is built with a modular component architecture:

- **WeatherBackground**: Handles dynamic background images and layout container
- **LocationSwitcher**: Toggles between default and current location views
- **SavedLocations**: Manages and displays saved location buttons
- **SearchBar**: Provides location search functionality
- **WeatherCard**: Displays current weather conditions
- **WeatherTabs**: Contains tab navigation for forecast and history data
- **ForecastTable**: Shows 3-day weather forecast
- **HistoryTable**: Shows 7-day weather history

## API Integration

The application uses the WeatherAPI service to fetch:

1. **Current weather conditions**: Temperature, humidity, wind speed, etc.
2. **3-day forecast**: Daily weather predictions for the upcoming days
3. **Historical data**: Weather conditions from the past 7 days

## Deployment

This application can be easily deployed to Vercel:

```bash
npm run build
# or
yarn build
```

Then follow the deployment steps for your preferred hosting platform.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [WeatherAPI](https://www.weatherapi.com/)
- Icons from [Lucide](https://lucide.dev/)
- Background images from [Unsplash](https://unsplash.com/)

---

Created with ❤️ by [Randila](https://github.com/RandilaP)
