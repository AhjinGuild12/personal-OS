import React, { useState, useEffect, useMemo } from 'react';
import { playClick } from '../../../utils/sounds';

type Condition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

interface CityWeather {
  name: string;
  temp: number;
  condition: Condition;
  utcOffset: number;
}

const ALL_WEATHER: CityWeather[] = [
  { name: 'San Francisco', temp: 51, condition: 'sunny', utcOffset: -8 },
  { name: 'Tokyo', temp: 48, condition: 'cloudy', utcOffset: 9 },
  { name: 'London', temp: 51, condition: 'sunny', utcOffset: 0 },
  { name: 'New York', temp: 38, condition: 'snowy', utcOffset: -5 },
  { name: 'Paris', temp: 46, condition: 'cloudy', utcOffset: 1 },
  { name: 'Sydney', temp: 77, condition: 'sunny', utcOffset: 11 },
  { name: 'Dubai', temp: 91, condition: 'sunny', utcOffset: 4 },
  { name: 'Seoul', temp: 29, condition: 'snowy', utcOffset: 9 },
  { name: 'Mumbai', temp: 84, condition: 'sunny', utcOffset: 5.5 },
  { name: 'Berlin', temp: 41, condition: 'rainy', utcOffset: 1 },
];

const DEFAULT_CITIES = ['San Francisco', 'Tokyo', 'London'];

const getTimeForOffset = (utcOffset: number, now: Date): string => {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityDate = new Date(utcMs + utcOffset * 3600000);
  const h = cityDate.getHours().toString().padStart(2, '0');
  const m = cityDate.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

const WeatherIcon: React.FC<{ condition: Condition; className?: string }> = ({ condition, className = 'w-7 h-7' }) => {
  switch (condition) {
    case 'sunny':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#f59e0b" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
            stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'cloudy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M6 19a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" fill="white" fillOpacity="0.3" />
        </svg>
      );
    case 'rainy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M6 15a4 4 0 01-.88-7.903A5 5 0 1115.9 2L16 2a5 5 0 011 9.9"
            stroke="white" strokeWidth="2" strokeLinecap="round" fill="white" fillOpacity="0.25" />
          <path d="M8 19v2m4-4v2m4-4v2" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'snowy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M6 15a4 4 0 01-.88-7.903A5 5 0 1115.9 2L16 2a5 5 0 011 9.9"
            stroke="white" strokeWidth="2" strokeLinecap="round" fill="white" fillOpacity="0.25" />
          <circle cx="8" cy="18" r="1" fill="white" />
          <circle cx="12" cy="20" r="1" fill="white" />
          <circle cx="16" cy="17" r="1" fill="white" />
        </svg>
      );
  }
};

const WeatherApp: React.FC = () => {
  const [activeCities, setActiveCities] = useState<CityWeather[]>(
    ALL_WEATHER.filter((c) => DEFAULT_CITIES.includes(c.name))
  );
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [now, setNow] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const availableCities = useMemo(
    () => ALL_WEATHER.filter((c) => !activeCities.some((a) => a.name === c.name)),
    [activeCities]
  );

  const addCity = (city: CityWeather) => {
    setActiveCities((prev) => [...prev, city]);
    setShowPicker(false);
    playClick();
  };

  const removeCity = (name: string) => {
    setActiveCities((prev) => {
      const filtered = prev.filter((c) => c.name !== name);
      if (selectedIndex >= filtered.length) {
        setSelectedIndex(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
    playClick();
  };

  return (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #5b98b5 0%, #8ec5db 35%, #b4daea 70%, #d4ecf4 100%)',
      }}
    >
      {/* City cards */}
      <div className="relative z-10">
        {activeCities.map((city, i) => {
          const isSelected = i === selectedIndex;

          return (
            <button
              key={city.name}
              onClick={() => {
                setSelectedIndex(i);
                playClick();
              }}
              className={`group w-full flex items-center justify-between px-5 py-3
                         border-b-[2px] border-black/15 text-left
                         transition-colors duration-100
                         ${isSelected
                           ? 'bg-black/20 text-white'
                           : 'bg-black/5 text-white hover:bg-black/10'
                         }`}
            >
              <div>
                <h3 className="font-black text-base">{city.name}</h3>
                <p className="text-xs font-bold opacity-60 mt-0.5">
                  {getTimeForOffset(city.utcOffset, now)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Remove button */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCity(city.name);
                  }}
                  className="w-5 h-5 flex items-center justify-center
                             opacity-0 group-hover:opacity-60 hover:!opacity-100
                             cursor-pointer transition-opacity duration-75"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span className="font-black text-3xl leading-none">{city.temp}</span>
                <WeatherIcon condition={city.condition} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Add City area */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Spacer pushes button toward middle */}
        <div className="flex-1" />

        <div className="relative">
          {showPicker && availableCities.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 bg-white/95 backdrop-blur
                           border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           max-h-40 overflow-y-auto">
              {availableCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => addCity(city)}
                  className="w-full px-4 py-2 text-left text-sm font-bold text-black
                             hover:bg-[#7eb8d0] hover:text-white transition-colors duration-75
                             border-b border-black/5 last:border-b-0
                             flex items-center justify-between"
                >
                  <span>{city.name}</span>
                  <span className="text-xs opacity-50">{city.temp}°F · {city.condition}</span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setShowPicker(!showPicker);
              playClick();
            }}
            className={`w-full py-3 text-center text-sm font-bold
                       transition-colors duration-75
                       ${availableCities.length === 0
                         ? 'text-white/20 cursor-not-allowed'
                         : 'text-white/40 hover:text-white/70'
                       }`}
            disabled={availableCities.length === 0}
          >
            Add City
          </button>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
};

export default WeatherApp;
