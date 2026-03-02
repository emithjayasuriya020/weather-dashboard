export const getWeatherData = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        )

        if (!response.ok){
            throw new Error("Wheather data could not be fetched");
        }

        const data = await response.json();

        return data;
    } catch(error){
        console.error("Error fetching weather:", error);
        return null;
    }
};