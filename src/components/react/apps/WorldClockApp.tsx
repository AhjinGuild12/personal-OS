import React, { useState, useEffect, useMemo } from 'react';
import { playClick } from '../../../utils/sounds';

interface CityZone {
  name: string;
  utcOffset: number; // hours from UTC
}

const ALL_CITIES: CityZone[] = [
  { name: 'Auckland', utcOffset: 13 },
  { name: 'San Francisco', utcOffset: -8 },
  { name: 'New York', utcOffset: -5 },
  { name: 'Shanghai', utcOffset: 8 },
  { name: 'Tokyo', utcOffset: 9 },
  { name: 'London', utcOffset: 0 },
  { name: 'Paris', utcOffset: 1 },
  { name: 'Dubai', utcOffset: 4 },
  { name: 'Mumbai', utcOffset: 5.5 },
  { name: 'Sydney', utcOffset: 11 },
  { name: 'Seoul', utcOffset: 9 },
  { name: 'Berlin', utcOffset: 1 },
  { name: 'Singapore', utcOffset: 8 },
  { name: 'Los Angeles', utcOffset: -8 },
  { name: 'Chicago', utcOffset: -6 },
  { name: 'Honolulu', utcOffset: -10 },
];

const DEFAULT_CITY_NAMES = ['Auckland', 'San Francisco', 'New York', 'Shanghai', 'Tokyo'];

const getTimeInZone = (utcOffset: number, now: Date): Date => {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + utcOffset * 3600000);
};

const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const formatDate = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

const WorldClockApp: React.FC = () => {
  const [cities, setCities] = useState<CityZone[]>(
    ALL_CITIES.filter((c) => DEFAULT_CITY_NAMES.includes(c.name))
  );
  const [now, setNow] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const primaryCity = cities[0];
  const otherCities = cities.slice(1);

  const primaryOffset = primaryCity?.utcOffset ?? 0;

  // Timeline "now" position: map current hour (0-24) to 0-100%
  const timelinePercent = useMemo(() => {
    if (!primaryCity) return 50;
    const t = getTimeInZone(primaryCity.utcOffset, now);
    return ((t.getHours() * 60 + t.getMinutes()) / 1440) * 100;
  }, [primaryCity, now]);

  const availableCities = ALL_CITIES.filter(
    (c) => !cities.some((active) => active.name === c.name)
  );

  const addCity = (city: CityZone) => {
    setCities((prev) => [...prev, city]);
    setShowPicker(false);
    playClick();
  };

  const removeCity = (name: string) => {
    setCities((prev) => prev.filter((c) => c.name !== name));
    playClick();
  };

  if (!primaryCity) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Primary city */}
      <div className="p-5 border-b-[3px] border-black">
        <div className="border-[3px] border-black p-4 flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl">{primaryCity.name}</h2>
            <p className="text-sm font-bold text-gray-500 mt-0.5">
              {formatDate(getTimeInZone(primaryCity.utcOffset, now))}
            </p>
          </div>
          <span className="font-black text-3xl">
            {formatTime(getTimeInZone(primaryCity.utcOffset, now))}
          </span>
        </div>
      </div>

      {/* Timeline slider */}
      <div className="px-5 py-4 border-b-[3px] border-black">
        <div className="border-[3px] border-black p-3">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-black rounded-full
                         shadow-[0_0_0_2px_white,0_0_0_4px_black]"
              style={{ left: `${timelinePercent}%`, transform: `translate(-50%, -50%)` }}
            />
          </div>
          <p className="text-center text-xs font-bold text-gray-400 mt-2">now</p>
        </div>
      </div>

      {/* City list */}
      <div className="flex-1 overflow-y-auto">
        {otherCities.map((city) => {
          const cityTime = getTimeInZone(city.utcOffset, now);
          const offsetDiff = city.utcOffset - primaryOffset;
          const sign = offsetDiff >= 0 ? '+' : '';

          return (
            <div
              key={city.name}
              className="group px-5 border-b-[2px] border-black/10 last:border-b-0"
            >
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-black text-base">{city.name}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    {sign}{offsetDiff} · {formatDate(cityTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl">
                    {formatTime(cityTime)}
                  </span>
                  <button
                    onClick={() => removeCity(city.name)}
                    className="w-5 h-5 flex-shrink-0 flex items-center justify-center
                               opacity-0 group-hover:opacity-100
                               text-gray-300 hover:text-[#e07a5f]
                               transition-all duration-75"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add City */}
      <div className="relative border-t-[3px] border-black">
        {showPicker && availableCities.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-[3px] border-black
                         border-b-0 shadow-[4px_-4px_0px_0px_rgba(0,0,0,1)]
                         max-h-48 overflow-y-auto">
            {availableCities.map((city) => (
              <button
                key={city.name}
                onClick={() => addCity(city)}
                className="w-full px-5 py-2 text-left text-sm font-bold
                           hover:bg-[#81b29a] hover:text-white transition-colors duration-75
                           border-b border-black/5 last:border-b-0"
              >
                {city.name}
                <span className="ml-2 text-xs opacity-60">
                  UTC{city.utcOffset >= 0 ? '+' : ''}{city.utcOffset}
                </span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            setShowPicker(!showPicker);
            playClick();
          }}
          className={`w-full py-3 text-center font-bold text-sm transition-colors duration-75
                     ${availableCities.length === 0
                       ? 'text-gray-300 cursor-not-allowed'
                       : 'text-gray-400 hover:bg-[#fdf6e3] hover:text-black'
                     }`}
          disabled={availableCities.length === 0}
        >
          Add City
        </button>
      </div>
    </div>
  );
};

export default WorldClockApp;
