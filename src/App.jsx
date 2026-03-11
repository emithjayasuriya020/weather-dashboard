import { useState, useEffect } from 'react';
import './App.css';
import { getWeatherData, getCoordinates, prefetchCityWeather } from './weatherService';
import WeatherCard from './components/WeatherCard';
import Auth from './components/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup' | null

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for the inline search bar
  const [searchInput, setSearchInput] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  // Load Colombo weather on initial mount
  useEffect(() => {
    handleSearch(null, 'Colombo');
    // Pre-cache popular cities in background
    ['London', 'New York', 'Tokyo', 'Paris'].forEach(city => prefetchCityWeather(city));
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setFavorites(data);
        // Pre-cache user's favorite cities in background!
        data.forEach(city => prefetchCityWeather(city.cityName));
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const handleSaveFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/favorites/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cityName: weather.cityName,
          countryCode: 'N/A', 
          lat: 0, 
          lon: 0 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.favoriteCities);
        alert(`${weather.cityName} saved successfully!`);
      } else {
        alert(data.message); 
      }
    } catch (err) {
      console.error("Failed to save city:", err);
    }
  };

  const handleRemoveFavorite = async (cityName, e) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/favorites/remove/${encodeURIComponent(cityName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.favoriteCities);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to remove city:", err);
    }
  };

  const handleSearch = async (e, cityOverride) => {
    if (e) e.preventDefault();
    const cityToSearch = cityOverride || searchInput;
    if (!cityToSearch) return;

    setLoading(true);
    setError(null);
    try {
      const coords = await getCoordinates(cityToSearch);
      const data = await getWeatherData(coords.latitude, coords.longitude);
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
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAuthMode(null);
  };

  const navigateHome = () => {
    setSearchInput('');
    setAuthMode(null);
    handleSearch(null, 'Colombo');
  };

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7fb' }}>
      
      {/* HEADER */}
      <header className="app-header">
        <div className="logo-container" style={{ cursor: 'pointer' }} onClick={navigateHome}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 17.5L17.5 17.5C20.5376 17.5 23 15.0376 23 12C23 9.07008 20.7093 6.67803 17.8593 6.42588C17.3826 3.03244 14.4697 0.398254 11 0.398254C7.13401 0.398254 4 3.53226 4 7.39825C4 7.53506 4.00392 7.67086 4.01166 7.80564C1.72126 8.15657 0 10.1128 0 12.3983C0 15.1597 2.23858 17.5 5 17.5H6.5Z" />
          </svg>
          <span className="logo-text">SkyCast</span>
        </div>
        
        <div className="nav-container">
          <span className="nav-link" onClick={navigateHome}>Forecasts</span>
          {!isAuthenticated ? (
            <>
              <button className="btn-login" onClick={() => setAuthMode('login')}>Login</button>
              <button className="btn-signup" onClick={() => setAuthMode('signup')}>Sign Up</button>
            </>
          ) : (
             <button className="btn-login" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {authMode ? (
        <div style={{ padding: '40px 0' }}>
           <Auth 
             onLoginSuccess={handleLoginSuccess} 
             onBack={() => setAuthMode(null)} 
             initialIsLogin={authMode === 'login'}
           />
        </div>
      ) : (
        <main className="hero-section" style={{ position: 'relative' }}>
          
          <div className="hero-left">
            <span className="hero-badge">Live Weather Updates</span>
            <h1 className="hero-title">
              Your Window<br/>
              to the <span className="text-blue">World's<br/>Sky.</span>
            </h1>
            <p className="hero-desc">
              Get hyper-local forecasts, severe weather alerts, and interactive radar maps for over 200,000 cities worldwide.
            </p>

            <form className="hero-search-container" onSubmit={(e) => handleSearch(e)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="hero-search-input" 
                placeholder="Enter city, region or zip code..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">Search</button>
            </form>

            <div style={{ minHeight: '30px', margin: '10px 0 15px 15px' }}>
              {loading && <p style={{ color: '#3b82f6', fontWeight: '600', margin: 0, animation: 'pulse 1.5s infinite' }}>Searching skies...</p>}
              {error && <p style={{ color: '#ef4444', fontWeight: '500', margin: 0 }}>{error}</p>}
            </div>
            
            {!isAuthenticated ? (
              <div className="popular-cities">
                Popular: 
                <span onClick={() => handleSearch(null, 'London')} onMouseEnter={() => prefetchCityWeather('London')}>London</span> 
                <span onClick={() => handleSearch(null, 'New York')} onMouseEnter={() => prefetchCityWeather('New York')}>New York</span> 
                <span onClick={() => handleSearch(null, 'Tokyo')} onMouseEnter={() => prefetchCityWeather('Tokyo')}>Tokyo</span> 
                <span onClick={() => handleSearch(null, 'Paris')} onMouseEnter={() => prefetchCityWeather('Paris')}>Paris</span>
              </div>
            ) : (
              <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#111827' }}>⭐ My Favorites</h3>
                {favorites.length === 0 ? (
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Save cities to quickly access them here.</p>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {favorites.map((city) => (
                      <div 
                        key={city.cityName} 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', 
                          padding: '6px 12px', borderRadius: '20px', cursor: 'pointer',
                          animation: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }}
                        onClick={() => handleSearch(null, city.cityName)}
                        onMouseEnter={() => prefetchCityWeather(city.cityName)}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>{city.cityName}</span>
                        <button 
                          onClick={(e) => handleRemoveFavorite(city.cityName, e)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', padding: '0', fontWeight: 'bold' }}
                        >✖</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hero-right">
            {weather && !loading ? (
              
              <div key={weather.cityName} style={{ width: '100%', maxWidth: '480px', animation: 'popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <WeatherCard data={weather} />
                
                {isAuthenticated && !favorites.some(f => f.cityName === weather.cityName) && (
                  <button 
                    onClick={handleSaveFavorite} 
                    style={{ marginTop: '15px', padding: '14px', width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    ⭐ Save {weather.cityName} to Favorites
                  </button>
                )}
              </div>
              
            ) : null}
          </div>
        </main>
      )}

      <footer style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '0.85rem', fontWeight: '500', borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff', marginTop: 'auto' }}>
        © 2024 SkyCast Weather Dashboard. All forecast data provided by Global Meteor.
      </footer>

    </div>
  );
}

export default App;