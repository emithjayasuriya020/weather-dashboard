const geocodeCache = new Map();

export const getCoordinates = async (city) => {
    const cacheKey = city.toLowerCase().trim();
    if (geocodeCache.has(cacheKey)) {
        return geocodeCache.get(cacheKey);
    }

    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        const data = await response.json();
        
        console.log("Geocoding Raw Data:", data);

        if (!data.results || data.results.length === 0) {
            throw new Error("City Not Found");
        }

        const result = data.results[0];
        geocodeCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error; 
    }
};

const weatherCache = new Map();

export const getWeatherData = async (lat, lon) => {
    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    
    // Check if we have recent weather (within 5 minutes)
    if (weatherCache.has(cacheKey)) {
        const { timestamp, data } = weatherCache.get(cacheKey);
        if (Date.now() - timestamp < 300000) { // 300,000 ms = 5 minutes
            return data;
        }
    }

    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        
        weatherCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
    } catch (error) {
        console.error("Weather Fetch Error:", error);
        return null;
    }
};

export const prefetchCityWeather = async (city) => {
    try {
        const coords = await getCoordinates(city);
        await getWeatherData(coords.latitude, coords.longitude);
    } catch (e) {
        // Silently ignore prefetch errors
    }
};
