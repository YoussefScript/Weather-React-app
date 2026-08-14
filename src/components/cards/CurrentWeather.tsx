import { useWeatherData } from "../../hooks/useWeatherData";
import Card from "./Card";
import { Coords } from "../../types";
import { Droplets, Wind, Thermometer, Clock } from "lucide-react";
import WeatherIcon from "../WeatherIcon";
import { useLanguage } from "../LanguageProvider";
import { useUnit } from "../UnitProvider";

type Props = {
  coords: Coords;
}

export default function CurrentWeather({ coords }: Props) {
  const { data } = useWeatherData(coords);
  const { t, language } = useLanguage();
  const { convertTemp, convertWindSpeed, windUnit } = useUnit();

  const getLocalTime = (dt: number, timezone: number) => {
    const date = new Date((dt + timezone) * 1000);
    return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: true
    });
  };

  return (
    <Card title={t('weather.currentIn').replace('{city}', data?.current.name || '...')} childrenClassName="flex flex-col items-center gap-5 md:gap-8 py-4">
      {/* Main Temp & Icon */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground drop-shadow-sm">
            {convertTemp(data?.current.temp || 0)}°
          </h1>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 border border-primary/20 shadow-inner">
            <WeatherIcon
              code={data?.current.weather[0].icon}
              title={data?.current.weather[0].description}
              className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm"
            />
          </div>
          <p className="text-base sm:text-lg text-foreground font-semibold capitalize tracking-tight text-center">
            {data?.current.weather[0].description}
          </p>
        </div>
      </div>

      {/* Local Time */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-muted/40 border border-border/50 backdrop-blur-sm">
        <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
        <div className="flex flex-col">
          <p className="text-[11px] sm:text-xs text-muted-foreground uppercase font-semibold tracking-[0.2em] leading-none mb-1">
            {t('weather.localTime')}
          </p>
          <p className="text-base sm:text-lg font-semibold tracking-tight">
            {data?.current ? getLocalTime(data.current.dt, data.current.timezone) : '--:--'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-3 gap-3 sm:gap-5 pt-5 sm:pt-6 border-t border-border/40">
        <div className="flex flex-col items-center gap-2 group">
          <div className="p-1.5 sm:p-2 rounded-xl bg-accent/20 border border-border/50 transition-colors group-hover:bg-primary/10 group-hover:border-primary/30">
            <Thermometer className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-[0.2em] mb-1">
              {t('weather.feelsLike')}
            </p>
            <p className="text-sm sm:text-base font-semibold">{convertTemp(data?.current.feels_like || 0)}°</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 group">
          <div className="p-1.5 sm:p-2 rounded-xl bg-accent/20 border border-border/50 transition-colors group-hover:bg-primary/10 group-hover:border-primary/30">
            <Droplets className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-[0.2em] mb-1">
              {t('weather.humidity')}
            </p>
            <p className="text-sm sm:text-base font-semibold">{data?.current.humidity}%</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 group">
          <div className="p-1.5 sm:p-2 rounded-xl bg-accent/20 border border-border/50 transition-colors group-hover:bg-primary/10 group-hover:border-primary/30">
            <Wind className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-[0.2em] mb-1">
              {t('weather.wind')}
            </p>
            <p className="text-sm sm:text-base font-semibold">{convertWindSpeed(data?.current.wind_speed || 0)} <span className="text-[9px] sm:text-[10px]">{windUnit}</span></p>
          </div>
        </div>
      </div>
    </Card>
  );
}
