import { useState, useEffect } from 'react';

const WMO_CODES = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mostly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Foggy', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌧️' },
  82: { label: 'Heavy showers', icon: '🌧️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
};

export const getWeatherInfo = (code) =>
  WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' };

const useWeather = (destination, startDate) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: geocode destination name → lat/lon
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          setError('Location not found');
          return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: fetch 7-day forecast
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
        );
        const weatherData = await weatherRes.json();

        const days = weatherData.daily.time.map((date, i) => ({
          date,
          code: weatherData.daily.weathercode[i],
          max: Math.round(weatherData.daily.temperature_2m_max[i]),
          min: Math.round(weatherData.daily.temperature_2m_min[i]),
        }));

        setWeather({ location: `${name}, ${country}`, days });
      } catch (err) {
        setError('Could not load weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  return { weather, loading, error };
};

export default useWeather;
