import { useWeatherData } from "../../hooks/useWeatherData";
import WeatherIcon from "../WeatherIcon";
import Card from "./Card";
import { Coords } from "../../types";
import { useLanguage } from "../LanguageProvider";
import { useUnit } from "../UnitProvider";

type Props = {
    coords: Coords;
}

export default function HourlyForecast({ coords }: Props) {
    const { data } = useWeatherData(coords);
    const { t, language } = useLanguage();
    const { convertTemp, unitSymbol } = useUnit();

    const getHour = (dt: number) => {
        return new Date(dt * 1000).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <Card title={t('weather.hourly')} childrenClassName="flex flex-row overflow-x-auto gap-5 pb-2">
            {
                data?.hourly.slice(0, 48).map(hour => (
                    <div key={hour.dt} className="flex flex-col items-center gap-2 min-w-[76px]">
                        <p className="text-muted-foreground whitespace-nowrap text-sm font-medium">{getHour(hour.dt)}</p>
                        <WeatherIcon code={hour.weather[0].icon} title={hour.weather[0].description} className="w-10 h-10" />
                        <p className="font-semibold text-base">{convertTemp(hour.temp)}{unitSymbol}</p>
                    </div>
                ))
            }
        </Card>
    );
}
