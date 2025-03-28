import React, { useEffect, useState } from 'react';

const DynamicBackground = ({ weatherCode, isDay }) => {
  const [raindrops, setRaindrops] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [stars, setStars] = useState([]);
  const [snowflakes, setSnowflakes] = useState([]);
  const [lightning, setLightning] = useState([]);

  useEffect(() => {
    // Setup clouds
    const newClouds = [];
    for (let i = 0; i < 6; i++) {
      let size = 'small';
      if (i < 2) size = 'large';
      else if (i < 4) size = 'medium';
      
      newClouds.push({
        id: i,
        size,
        top: `${Math.random() * 40 + 5}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 60}s`
      });
    }
    setClouds(newClouds);

    // Setup rain if weather is rainy
    if (weatherCode >= 300 && weatherCode < 600) {
      const newRaindrops = [];
      for (let i = 0; i < 100; i++) {
        newRaindrops.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 0.5 + 0.7}s`,
          animationDelay: `${Math.random() * 2}s`
        });
      }
      setRaindrops(newRaindrops);
    } else {
      setRaindrops([]);
    }

    // Setup stars if it's night
    if (!isDay) {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          top: `${Math.random() * 70}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 5}s`,
          size: Math.random() > 0.8 ? '3px' : '2px',
        });
      }
      setStars(newStars);
    } else {
      setStars([]);
    }

    // Setup snow if weather is snowy
    if (weatherCode >= 600 && weatherCode < 700) {
      const newSnowflakes = [];
      for (let i = 0; i < 50; i++) {
        newSnowflakes.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 8}s`,
          animationDelay: `${Math.random() * 5}s`,
          size: `${Math.random() * 6 + 3}px`
        });
      }
      setSnowflakes(newSnowflakes);
    } else {
      setSnowflakes([]);
    }

    // Setup lightning if weather is stormy
    if (weatherCode >= 200 && weatherCode < 300) {
      const newLightning = [];
      for (let i = 0; i < 3; i++) {
        newLightning.push({
          id: i,
          top: `${Math.random() * 40 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
          animationDelay: `${Math.random() * 5 + i * 3}s`,
          rotation: `${Math.random() * 40 - 20}deg`,
          scale: Math.random() * 0.5 + 0.7
        });
      }
      setLightning(newLightning);
    } else {
      setLightning([]);
    }
  }, [weatherCode, isDay]);

  // Determine background class based on weather code
  const getBackgroundClass = () => {
    if (weatherCode >= 200 && weatherCode < 300) return 'bg-storm'; // Thunderstorm
    if (weatherCode >= 300 && weatherCode < 600) return 'bg-rain'; // Rain
    if (weatherCode >= 600 && weatherCode < 700) return 'bg-snow'; // Snow
    if (weatherCode >= 700 && weatherCode < 800) return 'bg-clouds'; // Mist/Fog
    if (weatherCode === 800) return isDay ? 'bg-clear' : 'bg-night'; // Clear
    return isDay ? 'bg-clouds' : 'bg-night'; // Clouds or default
  };

  return (
    <div className={`dynamic-background ${getBackgroundClass()}`}>
      {/* Sun (only show during day and if clear or partly cloudy) */}
      {isDay && (weatherCode === 800 || weatherCode > 800) && <div className="sun"></div>}
      
      {/* Moon (only show at night) */}
      {!isDay && <div className="moon"></div>}
      
      {/* Clouds (show in most weather conditions) */}
      {weatherCode !== 800 && clouds.map(cloud => (
        <div 
          key={cloud.id}
          className={`cloud ${cloud.size}`}
          style={{
            top: cloud.top,
            left: cloud.left,
            animationDelay: cloud.delay
          }}
        ></div>
      ))}
      
      {/* Rain */}
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: drop.left,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay
          }}
        ></div>
      ))}
      
      {/* Stars (night only) */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay
          }}
        ></div>
      ))}
      
      {/* Snow */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay
          }}
        ></div>
      ))}
      
      {/* Lightning */}
      {lightning.map(bolt => (
        <div
          key={bolt.id}
          className="lightning"
          style={{
            top: bolt.top,
            left: bolt.left,
            transform: `rotate(${bolt.rotation}) scale(${bolt.scale})`,
            animationDelay: bolt.animationDelay
          }}
        ></div>
      ))}
    </div>
  );
};

export default DynamicBackground;