import { useWeatherData } from "../../hooks/useWeatherData";
import WeatherIcon from "../WeatherIcon";
import Card from "./Card";
import { Coords } from "../../types";
import { useLanguage } from "../LanguageProvider";
import { useUnit } from "../UnitProvider";

type Props = {
  coords: Coords;
}

export default function DailyForecast({ coords }: Props) {
  const { data } = useWeatherData(coords);
  const { t, language } = useLanguage();
  const { convertTemp, unitSymbol } = useUnit();

  const getDayName = (dt: number) => {
    return new Date(dt * 1000).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
  };

  return (
    <Card title={t('weather.daily')} childrenClassName="flex flex-col gap-2 overflow-x-auto">
      <div className="grid grid-cols-5 min-w-[320px] text-[11px] sm:text-xs text-muted-foreground font-semibold text-center uppercase tracking-wider">
        <p className="text-left">{t('weather.day')}</p>
        <p></p>
        <p>{t('weather.high')}</p>
        <p>{t('weather.low')}</p>
        <p>{t('weather.feels')}</p>
      </div>
      {data?.daily.map((day: any) => (
        <div key={day.dt} className="grid grid-cols-5 min-w-[320px] items-center text-center text-xs sm:text-sm">
          <p className="text-left font-medium">{getDayName(day.dt)}</p>
          <div className="flex justify-center">
            <WeatherIcon code={day.weather[0].icon} title={day.weather[0].description} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <p className="font-medium">{convertTemp(day.temp.max)}{unitSymbol}</p>
          <p className="text-muted-foreground font-medium">{convertTemp(day.temp.min)}{unitSymbol}</p>
          <p className="text-muted-foreground/80 text-[11px] sm:text-xs">{convertTemp(day.feels_like.day)}{unitSymbol}</p>
        </div>
      ))
      }
    </Card>
  );
}
