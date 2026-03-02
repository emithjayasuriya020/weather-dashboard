import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react';
import { getWeatherData } from './weatherService';

function App() {
  useEffect(() => {
    const testWeather = async () => {
      const data = await getWeatherData(52.52, 13.41);
      console.log("My Weather Data: ", data);
    };

    testWeather();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Check The console</h1>
      <p>Right-click , Inspect , Console to see the live data</p>
    </div>
  )
}
export default App;
