import DailyForecast from './components/cards/DailyForecast';
import HourlyForecast from './components/cards/HourlyForecast';
import CurrentWeather from './components/cards/CurrentWeather';
import AdditionalInfo from './components/cards/AdditionalInfo';
import Map from './components/Map';
import { useState, useEffect } from 'react';
import { Coords } from './types';
import LiveLocation from './components/LiveLocation';
import CitySearch from './components/CitySearch';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageProvider, useLanguage } from './components/LanguageProvider';
import { LanguageToggle } from './components/LanguageToggle';
import { UnitProvider } from './components/UnitProvider';
import { UnitToggle } from './components/UnitToggle';
import { Map as MapIcon, EyeOff } from 'lucide-react';
import { Button } from './components/ui/button';

/* Footer Component مع AdSense */
function Footer() {
  const { t } = useLanguage();

  return (
    <footer className='py-6 md:py-8 text-center text-muted-foreground text-xs font-medium border-t border-border/30 mt-4 md:mt-8 flex flex-col items-center gap-2'>
      <p>{t('app.footer').replace('{year}', new Date().getFullYear().toString())}</p>
      <p className="opacity-50 italic">{t('app.poweredBy')}</p>


    </footer>
  );
}

function AppContent() {
  const [coords, setCoords] = useState<Coords>({ lat: 24.0889, lon: 32.8998 });
  const [showMap, setShowMap] = useState(false);
  const { t } = useLanguage();

  const onLocationUpdate = (lat: number, lon: number) => {
    setCoords({ lat, lon });
  }

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Initial geolocation failed:", error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    }
  }, []);

  return (
    <div className='min-h-screen bg-background text-foreground transition-colors duration-300'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 flex flex-col gap-6 md:gap-10 animate-in fade-in duration-700'>

        {/* Header Section */}
        <header className='flex flex-col md:flex-row justify-between items-center gap-4 p-4 md:p-5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/60 shadow-lg'>
          <div className='flex flex-col gap-1 text-center md:text-left'>
            <h1 className='text-xl md:text-2xl font-semibold tracking-tight'>
              {t('app.title')}
            </h1>
            <p className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
              {t('app.subtitle')}
            </p>
          </div>

          <div className='flex flex-wrap justify-center items-center gap-3 md:gap-4 w-full md:w-auto'>
            <div className='flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl bg-background/60 border border-border/60 w-full sm:w-auto'>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <LiveLocation onLocationUpdate={onLocationUpdate} />
                <CitySearch onCitySelect={onLocationUpdate} />
              </div>
              <div className="w-px h-6 bg-border/40 mx-1 hidden md:block" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center gap-2 px-3 rounded-lg transition-all duration-300 w-full sm:w-auto ${showMap ? 'bg-primary/15 text-primary' : 'hover:bg-accent'}`}
              >
                {showMap ? <EyeOff className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                <span className="text-xs font-semibold">{showMap ? t('map.hide') : t('map.show')}</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <UnitToggle />
              <ThemeToggle />
              <div className="col-span-2 sm:block">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className='grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8'>
          {/* Map Section */}
          {showMap && (
            <div className='order-0 lg:order-1 lg:col-span-8 overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 shadow-xl animate-in fade-in zoom-in-95 duration-500'>
              <Map coords={coords} onMapClick={onLocationUpdate} />
            </div>
          )}

          {/* Status & Info */}
          <div className={`order-1 ${showMap ? 'lg:order-2 lg:col-span-4' : 'lg:order-2 lg:col-span-5'} flex flex-col gap-6 md:gap-8 transition-all duration-500`}>
            <CurrentWeather coords={coords} />
            <AdditionalInfo coords={coords} />
          </div>

          {/* Detailed Forecasts */}
          <div className={`order-2 ${showMap ? 'lg:order-3 lg:col-span-8' : 'lg:order-1 lg:col-span-7'} flex flex-col gap-6 md:gap-8 transition-all duration-500`}>
            <HourlyForecast coords={coords} />
            <DailyForecast coords={coords} />
          </div>
        </main>

        {/* Footer with AdSense */}
        <Footer />

      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="dark" storageKey="weather-app-theme">
        <UnitProvider>
          <AppContent />
        </UnitProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
