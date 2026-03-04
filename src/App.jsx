import { useState } from 'react'
import './App.css'
import { getWeatherData, getCoordinates } from './weatherService'; // Added getCoordinates
import WeatherCard from './components/WeatherCard';
import ForecastGrid from './components/ForecastGrid';
import SearchBar from './components/SearchBar';
import Auth from './components/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCoordinates(city);
      
      const data = await getWeatherData(coords.latitude, coords.longitude);
      
      console.log("Weather received:", data);
      
      setWeather({ ...data, cityName: coords.name });
    } catch (err) {
      console.error(err);
      setError("Could not find that city. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setWeather(null);
  }

  return (
    <div className="app">
      <header style={{ style: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Weather Dashboard</h1>
        {/* Only show the Logout button if they are actually logged in */}
        {isAuthenticated && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer'}}>
            Logout
          </button>
        )}
      </header>

      <main>
        {!isAuthenticated ? (
          <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <>
            <SearchBar onSearch={handleSearch} />

            {loading && <p>Loading Weather...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weather && <WeatherCard data={weather} />}
          </>  
        )}
      </main>
    </div>
  )};

export default App;