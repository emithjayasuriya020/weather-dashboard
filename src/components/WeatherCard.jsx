export default  function WeatherCard({ data }) {
    return (
        <div className="weather-card">
            <h2>{data.cityName}</h2>
            <h1>{data.current_weather.temperature}°C</h1>
            <p>Wind speed: {data.current_weather.windspeed} km/h</p>
        </div>
    );
}