import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react';
import { getWeatherData } from './weatherService';
import { WeatherCard } from './components/WeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { SearchBar } from './components/SearchBar';

function App() {
  useEffect(() => {
    const testWeather = async () => {
      const data = await getWeatherData(52.52, 13.41);
      console.log("My Weather Data: ", data);
    };

    testWeather();
  }, []);

  return (
    <div className="app-container">
      <h1>SkyCast Weather</h1>
      
      <SearchBar/>
      <WeatherCard/>
      <ForecastGrid/>
    </div>
  )
}
export default App;
