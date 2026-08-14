import React from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, Zap, Droplets } from 'lucide-react';

type Props = {
  code?: string | null;
  className?: string;
  title?: string;
};

export default function WeatherIcon({ code, className = 'w-6 h-6', title }: Props) {
  const iconCode = code || '';
  const main = iconCode.slice(0, 2);
  const isDay = iconCode.endsWith('d');

  const common = { className } as any;

  // Map OpenWeather icon codes to lucide-react icons
  switch (main) {
    case '01':
      return isDay ? <Sun {...common} title={title} /> : <Moon {...common} title={title} />;
    case '02':
      return <Cloud {...common} title={title} />;
    case '03':
      return <Cloud {...common} title={title} />;
    case '04':
      return <Cloud {...common} title={title} />;
    case '09':
      return <CloudRain {...common} title={title} />;
    case '10':
      return <CloudRain {...common} title={title} />;
    case '11':
      return <Zap {...common} title={title} />;
    case '13':
      return <CloudSnow {...common} title={title} />;
    case '50':
      return <Droplets {...common} title={title} />;
    default:
      return <Cloud {...common} title={title} />;
  }
}
