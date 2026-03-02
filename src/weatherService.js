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

        return data.results[0];
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error; 
    }
};

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
