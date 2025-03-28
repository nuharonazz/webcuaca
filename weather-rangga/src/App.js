import React, { useState, useEffect, useRef } from 'react';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightCloudy, 
  WiRain, WiSnow, WiThunderstorm, WiWindy, WiHumidity,
  WiStrongWind, WiBarometer, WiThermometer 
} from 'react-icons/wi';
import { FaSearch, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [city, setCity] = useState('Jakarta');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [skyClass, setSkyClass] = useState('sky-day-clear');
  // Tambahkan state untuk mengontrol tab yang aktif
  const [activeTab, setActiveTab] = useState('hourly');
  
  // Refs for animation elements
  const skyRef = useRef(null);
  const cloudRef1 = useRef(null);
  const cloudRef2 = useRef(null);
  const cloudRef3 = useRef(null);
  const rainRef = useRef(null);
  const snowRef = useRef(null);
  const starsRef = useRef(null);
  
  // API key from OpenWeatherMap
  const API_KEY = '0c854b30810ba8e3e1f55b2eeabe6da6';
  
  useEffect(() => {
    fetchWeather(city);
  }, [city]);
  
  useEffect(() => {
    if (weather) {
      updateSkyBackground();
      createAnimatedElements();
    }
  }, [weather, isDay]);
  
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
      
      // Check if it's day or night
      const now = new Date().getTime() / 1000;
      const isDaytime = now > data.sys.sunrise && now < data.sys.sunset;
      setIsDay(isDaytime);
      
      // Fetch forecast data
      fetchForecast(cityName);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const fetchForecast = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Forecast data not available');
      }
      
      const data = await response.json();
      
      // Process daily forecast (one per day)
      const dailyData = [];
      const uniqueDays = {};
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!uniqueDays[date]) {
          uniqueDays[date] = true;
          dailyData.push(item);
        }
      });
      
      setForecast(dailyData.slice(0, 5));
      
      // Process hourly forecast (next 24 hours)
      setHourlyForecast(data.list.slice(0, 8));
      
    } catch (err) {
      console.error('Error fetching forecast:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateSkyBackground = () => {
    if (!weather) return;
    
    const weatherId = weather.weather[0].id;
    
    // Determine the sky class based on weather condition and time of day
    if (weatherId >= 200 && weatherId < 300) {
      // Thunderstorm
      setSkyClass(isDay ? 'sky-rain' : 'sky-night-clouds');
    } else if (weatherId >= 300 && weatherId < 600) {
      // Rain and drizzle
      setSkyClass(isDay ? 'sky-rain' : 'sky-night-clouds');
    } else if (weatherId >= 600 && weatherId < 700) {
      // Snow
      setSkyClass(isDay ? 'sky-day-clouds' : 'sky-night-clouds');
    } else if (weatherId >= 700 && weatherId < 800) {
      // Atmosphere (fog, mist, etc.)
      setSkyClass(isDay ? 'sky-day-clouds' : 'sky-night-clouds');
    } else if (weatherId === 800) {
      // Clear sky
      setSkyClass(isDay ? 'sky-day-clear' : 'sky-night-clear');
    } else {
      // Cloudy
      setSkyClass(isDay ? 'sky-day-clouds' : 'sky-night-clouds');
    }
  };
  
  const createAnimatedElements = () => {
    if (!skyRef.current) return;
    
    // Clear previous elements
    while (skyRef.current.firstChild) {
      skyRef.current.removeChild(skyRef.current.firstChild);
    }
    
    const weatherId = weather?.weather?.[0]?.id;
    
    // Add sun or moon
    if (isDay && (weatherId === 800 || (weatherId >= 801 && weatherId <= 802))) {
      const sun = document.createElement('div');
      sun.className = 'sun';
      skyRef.current.appendChild(sun);
    } else if (!isDay) {
      const moon = document.createElement('div');
      moon.className = 'moon';
      skyRef.current.appendChild(moon);
    }
    
    // Add stars at night
    if (!isDay) {
      const stars = document.createElement('div');
      stars.className = 'stars';
      
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        stars.appendChild(star);
      }
      
      skyRef.current.appendChild(stars);
    }
    
    // Add clouds for most weather conditions
    if (weatherId !== 800 || !isDay) {
      // Number of clouds depends on the weather condition
      const cloudCount = weatherId >= 801 && weatherId <= 804 ? 5 : 3;
      
      for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = `cloud cloud-${i % 3 + 1}`;
        
        // Randomize cloud positions
        cloud.style.top = `${Math.random() * 40 + 5}%`;
        cloud.style.left = `${Math.random() * 100 - 20}%`;
        cloud.style.animationDelay = `${Math.random() * 10}s`;
        
        // Make clouds darker at night
        if (!isDay) {
          cloud.style.opacity = '0.6';
          cloud.style.filter = 'brightness(0.7)';
        }
        
        skyRef.current.appendChild(cloud);
      }
    }
    
    // Add rain
    if ((weatherId >= 300 && weatherId < 600) || (weatherId >= 200 && weatherId < 300)) {
      const rainContainer = document.createElement('div');
      rainContainer.className = 'rain-container';
      
      const dropCount = weatherId >= 500 && weatherId < 600 ? 100 : 50;
      
      for (let i = 0; i < dropCount; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        raindrop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(raindrop);
      }
      
      skyRef.current.appendChild(rainContainer);
    }
    
    // Add snow
    if (weatherId >= 600 && weatherId < 700) {
      const snowContainer = document.createElement('div');
      snowContainer.className = 'rain-container';
      
      for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.width = `${Math.random() * 5 + 3}px`;
        snowflake.style.height = snowflake.style.width;
        snowflake.style.animationDuration = `${Math.random() * 3 + 5}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        snowContainer.appendChild(snowflake);
      }
      
      skyRef.current.appendChild(snowContainer);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity);
      setSearchCity('');
    }
  };
  
  // Fungsi untuk mengubah tab aktif
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Get weather icon
  const getWeatherIcon = (id) => {
    if (id >= 200 && id < 300) return <WiThunderstorm />;
    if (id >= 300 && id < 600) return <WiRain />;
    if (id >= 600 && id < 700) return <WiSnow />;
    if (id >= 700 && id < 800) return <WiWindy />;
    if (id === 800) return isDay ? <WiDaySunny /> : <WiNightClear />;
    return isDay ? <WiDayCloudy /> : <WiNightCloudy />;
  };
  
  return (
    <div className="weather-app">
      {/* Animated Sky Background */}
      <div ref={skyRef} className={`sky-background ${skyClass}`}></div>
      
      {/* Hero Section with Search */}
      <div className="hero-section">
        <h1>Find Weather Forecast</h1>
        <div className="search-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
      
      {/* Weather Display */}
      <div className="weather-display">
        {loading ? (
          <div className="weather-card loading-container">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="weather-card error-container">
            <p>{error}</p>
            <button onClick={() => fetchWeather('Jakarta')}>
              Try with default city
            </button>
          </div>
        ) : weather ? (
          <>
            {/* Current Weather Card */}
            <div className="weather-card">
              <div className="current-weather">
                <div className="weather-info">
                  <div className="location">
                    <FaMapMarkerAlt />
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className="date-time">
                    <FaRegClock style={{ marginRight: '5px' }} />
                    {formatDateTime(weather.dt)}
                  </div>
                  <div className="temperature">
                    {Math.round(weather.main.temp)}<span>°C</span>
                  </div>
                  <div className="weather-condition">
                    {weather.weather[0].description}
                  </div>
                  <div className="weather-details">
                    <div className="detail">
                      <WiThermometer />
                      Feels like: {Math.round(weather.main.feels_like)}°C
                    </div>
                    <div className="detail">
                      <WiHumidity />
                      Humidity: {weather.main.humidity}%
                    </div>
                    <div className="detail">
                      <WiStrongWind />
                      Wind: {Math.round(weather.wind.speed * 3.6)} km/h
                    </div>
                  </div>
                </div>
                <div className="weather-icon">
                  {getWeatherIcon(weather.weather[0].id)}
                </div>
              </div>
            </div>
            
            {/* Forecast Tabs */}
            <div className="forecast-tabs">
              <div 
                className={`tab ${activeTab === 'hourly' ? 'active' : ''}`}
                onClick={() => handleTabChange('hourly')}
              >
                Hourly
              </div>
              <div 
                className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => handleTabChange('daily')}
              >
                Daily
              </div>
            </div>
            
            {/* Hourly Forecast - hanya tampilkan jika tab aktif adalah 'hourly' */}
            {hourlyForecast && activeTab === 'hourly' && (
              <div className="weather-card">
                <div className="hourly-forecast">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="hour-item">
                      <div className="hour-time">{formatTime(hour.dt)}</div>
                      <div className="hour-icon">
                        {getWeatherIcon(hour.weather[0].id)}
                      </div>
                      <div className="hour-temp">{Math.round(hour.main.temp)}°</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Daily Forecast - hanya tampilkan jika tab aktif adalah 'daily' */}
            {forecast && activeTab === 'daily' && (
              <div className="weather-card">
                <div className="daily-forecast">
                  {forecast.map((day, index) => (
                    <div key={index} className="day-item">
                      <div className="day-name">{formatDay(day.dt)}</div>
                      <div className="day-condition">
                        <div className="day-icon">
                          {getWeatherIcon(day.weather[0].id)}
                        </div>
                        <div className="day-description">
                          {day.weather[0].description}
                        </div>
                      </div>
                      <div className="day-temp">
                        <span className="max">{Math.round(day.main.temp_max)}°</span>
                        <span className="min">{Math.round(day.main.temp_min)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;