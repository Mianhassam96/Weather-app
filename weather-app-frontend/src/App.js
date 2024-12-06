import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchWeather = async () => {
    if (!city) return alert("Please enter a city name.");
    try {
      const weatherResponse = await axios.get(`http://localhost:5000/weather?city=${city}`);
      const forecastResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=58cf7693a2dc815197c063468b1e8655`
      );
      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0)); // Show data at 3-hour intervals
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data.");
    }
  };

  const toggleTemperatureUnit = () => setIsCelsius(!isCelsius);

  const formatTemperature = (temp) =>
    isCelsius
      ? `${(temp - 273.15).toFixed(1)}°C`
      : `${(((temp - 273.15) * 9) / 5 + 32).toFixed(1)}°F`;

  const getBackgroundClass = () => {
    if (!weather) return "default-weather";
    const condition = weather.weather[0].main.toLowerCase();

    switch (condition) {
      case "clear":
        return "clear-sky";
      case "clouds":
        return "cloudy";
      case "rain":
      case "drizzle":
        return "rainy";
      case "thunderstorm":
        return "stormy";
      case "snow":
        return "snowy";
      case "mist":
      case "haze":
      case "fog":
        return "foggy";
      default:
        return "default-weather";
    }
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <div className="content-container">
        <h1 className="weather-app-title">Weather App</h1>
        
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchWeather}>
            Get Weather
          </button>
        </div>

        {weather && (
          <>
            <div className="weather-box animate-card">
              <h2>{weather.name}</h2>
              <p>{weather.weather[0].description}</p>
              <p>
                <strong>Temp:</strong> {formatTemperature(weather.main.temp)}
              </p>
              <p>
                <strong>Feels Like:</strong> {formatTemperature(weather.main.feels_like)}
              </p>
              <button className="unit-toggle" onClick={toggleTemperatureUnit}>
                {isCelsius ? "Switch to °F" : "Switch to °C"}
              </button>
            </div>

            <div className="map-container mt-4">
              <MapContainer
                center={[weather.coord.lat, weather.coord.lon]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "500px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[weather.coord.lat, weather.coord.lon]} />
              </MapContainer>
            </div>

            <div className="forecast-container">
              <h3>5-Day Forecast</h3>
              <div className="forecast-grid">
                {forecast &&
                  forecast.map((item, index) => (
                    <div key={index} className="forecast-card">
                      <p>
                        <strong>
                          {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </strong>
                      </p>
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                      />
                      <p>{item.weather[0].description}</p>
                      <p>{formatTemperature(item.main.temp)}</p>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Created by 
          <a href="https://github.com/Mianhassam96"> MultiMian</a>
        </p>
       
      </footer>
    </div>
  );
};

export default App;
