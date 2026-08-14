const API_KEY = import.meta.env.VITE_API_KEY;
import { oneCallLikeSchema, HourlyWeather } from "./schemas/wetherSchema";

export async function getWeather(lat: string, lon: string, lang: string = 'en') {
  // 1️⃣ Fetch current weather
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=${lang}`
  );
  const currentData = await currentRes.json();

  if (!currentRes.ok || !currentData || !currentData.main) {
    // Provide a helpful error for debugging instead of failing with undefined accesses
    console.error('getWeather: unexpected current weather response', { status: currentRes.status, body: currentData });
    throw new Error(`Failed to fetch current weather: ${currentRes.status} ${currentRes.statusText}`);
  }

  const current = {
    dt: currentData.dt,
    temp: currentData.main.temp,
    feels_like: currentData.main.feels_like,
    humidity: currentData.main.humidity,
    pressure: currentData.main.pressure,
    wind_speed: currentData.wind.speed,
    wind_deg: currentData.wind.deg,
    clouds: currentData.clouds.all,
    weather: currentData.weather,
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
    timezone: currentData.timezone,
    name: currentData.name,
  };

  // 2️⃣ Fetch 5-day forecast (3-hour intervals)
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=${lang}`
  );
  const forecastData = await forecastRes.json();

  if (!forecastRes.ok || !forecastData || !Array.isArray(forecastData.list)) {
    console.error('getWeather: unexpected forecast response', { status: forecastRes.status, body: forecastData });
    throw new Error(`Failed to fetch forecast: ${forecastRes.status} ${forecastRes.statusText}`);
  }

  // Transform forecast.list into hourly (interpolating 3-hour data to 1-hour)
  const hourly: any[] = [];
  const list = forecastData.list;

  if (!list || list.length === 0) {
    // If no forecast list is provided, return a minimal structure with current data only
    const finalData = { current, hourly: [], daily: [] };
    return oneCallLikeSchema.parse(finalData);
  }

  for (let i = 0; i < list.length - 1; i++) {
    const start = list[i];
    const end = list[i + 1];

    for (let j = 0; j < 3; j++) {
      const fraction = j / 3;
      // Linear interpolation helper
      const lerp = (start: number, end: number) => start + (end - start) * fraction;

      hourly.push({
        dt: start.dt + j * 3600,
        temp: lerp(start.main.temp, end.main.temp),
        feels_like: lerp(start.main.feels_like, end.main.feels_like),
        humidity: lerp(start.main.humidity, end.main.humidity),
        pressure: lerp(start.main.pressure, end.main.pressure),
        wind_speed: lerp(start.wind.speed, end.wind.speed),
        wind_deg: lerp(start.wind.deg, end.wind.deg),
        clouds: lerp(start.clouds.all, end.clouds.all),
        weather: start.weather, // Keep icon consistent for the interval
      });
    }
  }

  // Transform hourly into daily (aggregate min/max for each day)
  const dailyMap: Record<string, HourlyWeather[]> = {};
  hourly.forEach((h: HourlyWeather) => {
    const day = new Date(h.dt * 1000).toISOString().split("T")[0];
    if (!dailyMap[day]) dailyMap[day] = [];
    dailyMap[day].push(h);
  });

  const daily = Object.entries(dailyMap).map(([day, hours]) => {
    const temps = hours.map((h: HourlyWeather) => h.temp);
    const feels = hours.map((h: HourlyWeather) => h.feels_like);
    const pressures = hours.map((h: HourlyWeather) => h.pressure);
    const humidities = hours.map((h: HourlyWeather) => h.humidity);
    const winds = hours.map((h: HourlyWeather) => h.wind_speed);
    const clouds = hours.map((h: HourlyWeather) => h.clouds);
    const weather = hours[0].weather; // take first as representative

    return {
      dt: new Date(day).getTime() / 1000,
      temp: { min: Math.min(...temps), max: Math.max(...temps) },
      feels_like: { day: feels[0], night: feels[feels.length - 1] },
      humidity: Math.max(...humidities),
      pressure: Math.max(...pressures),
      wind_speed: Math.max(...winds),
      wind_deg: hours[0].wind_deg,
      clouds: Math.max(...clouds),
      weather,
    };
  });

  const finalData = { current, hourly, daily };

  // Validate with Zod
  return oneCallLikeSchema.parse(finalData);
}

export async function getGeocode(cityName: string) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error(`Geocoding failed: ${res.statusText}`);
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error(`No results found for "${cityName}"`);
  }

  return data[0]; // Return first result
}
