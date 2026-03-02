import { useState } from 'react'
import './App.css'
import { getWeatherData, getCoordinates } from './weatherService'; // Added getCoordinates
import WeatherCard from './components/WeatherCard';
import ForecastGrid from './components/ForecastGrid';
import SearchBar from './components/SearchBar';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get the coordinates for the city name
      const coords = await getCoordinates(city);
      
      // 2. Use those coordinates to get the weather
      const data = await getWeatherData(coords.latitude, coords.longitude);
      
      console.log("Weather received:", data); // Check your console for this!
      
      // 3. Save everything to state
      setWeather({ ...data, cityName: coords.name });
    } catch (err) {
      console.error(err);
      setError("Could not find that city. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <p>Loading weather...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && <WeatherCard data={weather} />}
    </div>
  )
}

export default App;