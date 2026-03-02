// 1. The Translator: Turns "London" into Lat: 51, Lon: 0
export const getCoordinates = async (city) => {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        const data = await response.json();
        
        console.log("Geocoding Raw Data:", data);

        if (!data.results || data.results.length === 0) {
            throw new Error("City Not Found");
        }

        // Return the first result (latitude, longitude, and name)
        return data.results[0];
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error; // Let App.jsx handle the error message
    }
};

// 2. The Weather Fetcher: Uses the numbers to get the actual temperature
export const getWeatherData = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Weather Fetch Error:", error);
        return null;
    }
};