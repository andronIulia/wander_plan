import React, { useState } from 'react';
import useWeather, { getWeatherInfo } from '../hooks/useWeather';
import './WeatherWidget.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeatherWidget = ({ destination, startDate }) => {
  const { weather, loading, error } = useWeather(destination, startDate);
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="weather-widget weather-loading">
        <span className="weather-spinner" />
        <span>Loading weather…</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-widget weather-error">
        🌡️ Weather unavailable
      </div>
    );
  }

  const today = weather.days[0];
  const todayInfo = getWeatherInfo(today.code);
  const forecast = weather.days.slice(1, 4);

  return (
    <div className="weather-widget">
      <button
        className="weather-summary"
        onClick={() => setExpanded(!expanded)}
        aria-label="Toggle forecast"
      >
        <span className="weather-icon-lg">{todayInfo.icon}</span>
        <div className="weather-main">
          <span className="weather-label">{todayInfo.label}</span>
          <span className="weather-temp">
            {today.max}° / {today.min}°
          </span>
        </div>
        <span className="weather-location">📍 {weather.location}</span>
        <span className="weather-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="weather-forecast">
          {forecast.map((day) => {
            const info = getWeatherInfo(day.code);
            const date = new Date(day.date);
            const dayName = DAYS_OF_WEEK[date.getDay()];
            return (
              <div key={day.date} className="forecast-day">
                <span className="forecast-name">{dayName}</span>
                <span className="forecast-icon">{info.icon}</span>
                <span className="forecast-temps">
                  <span className="forecast-max">{day.max}°</span>
                  <span className="forecast-min">{day.min}°</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
