import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  desc: string;
}

const CACHE_KEY = "posyandu_weather_cache";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const weatherCodes: Record<number, string> = {
  0: "Cerah",
  1: "Cerah Berawan",
  2: "Berawan Sebagian",
  3: "Berawan",
  45: "Berkabut",
  48: "Berkabut Tebal",
  51: "Gerimis Ringan",
  53: "Gerimis",
  55: "Gerimis Lebat",
  61: "Hujan Ringan",
  63: "Hujan",
  65: "Hujan Lebat",
  71: "Hujan Salju Ringan",
  73: "Hujan Salju",
  75: "Hujan Salju Lebat",
  80: "Hujan Lokal",
  81: "Hujan Lokal Sedang",
  82: "Hujan Lokal Lebat",
  95: "Badai Petir",
  96: "Badai Petir + Hujan Es",
  99: "Badai Petir Hebat",
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherForLocation = async (
      latitude: number,
      longitude: number,
    ) => {
      const locationKey = `${CACHE_KEY}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

      // Check cache first
      try {
        const cached = localStorage.getItem(locationKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION_MS) {
            setWeather(data);
            setIsLoading(false);
            console.log("[Weather] Using cached data for location");
            return;
          }
        }
      } catch {
        // Cache read failed, continue to fetch
      }

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=Asia/Jakarta`,
        );
        const data = await res.json();

        const weatherData = {
          temp: Math.round(data.current.temperature_2m),
          desc: weatherCodes[data.current.weather_code] || "Tidak Diketahui",
        };

        setWeather(weatherData);
        setIsLoading(false);

        // Save to cache
        try {
          localStorage.setItem(
            locationKey,
            JSON.stringify({
              data: weatherData,
              timestamp: Date.now(),
            }),
          );
        } catch {
          // Cache write failed
        }
      } catch (error) {
        console.warn("[Weather] Failed to fetch:", error);
        setIsLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherForLocation(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        () => {
          // Fallback to Yogyakarta
          fetchWeatherForLocation(-7.7956, 110.3695);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10 * 60 * 1000,
        },
      );
    } else {
      fetchWeatherForLocation(-7.7956, 110.3695);
    }
  }, []);

  return { weather, isLoading };
}
