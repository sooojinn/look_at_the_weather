import useLocationData from '@/hooks/useLocationData';
import useWeatherData from '@/hooks/useWeatherData';
import Location from '@components/common/molecules/LocationComponent';
import Spinner from '@components/icons/Spinner';
import CurrentTemp from '@components/weather/CurrentTemp';
import MinMaxTemps from '@components/weather/MinMaxTemps';
import WeatherImg from '@components/weather/WeatherImg';
import WeatherMessage from '@components/weather/WeatherMessage';

export default function HomeWeatherInfo() {
  const { geoPoint, location, isLocationLoading, isLocationSuccess, isLocationError } = useLocationData();
  const { weatherData, isWeatherLoading, isWeatherSuccess, isWeatherError, handleRefetch } = useWeatherData(geoPoint);
  const { currentTemp, weatherMessage, weatherType, minTemp, maxTemp } = weatherData;

  const isLoading = isLocationLoading || isWeatherLoading;
  const isSuccess = isLocationSuccess && isWeatherSuccess;
  const isError = isLocationError || isWeatherError;

  const backgroundType: 'light' | 'normal' | 'dark' = (() => {
    if (currentTemp >= 33 && weatherType === 'clear') {
      return 'light';
    } else if (weatherType === 'clear' || weatherType === 'partly_cloudy') {
      return 'normal';
    } else {
      return 'dark';
    }
  })();

  const backgroundStyle = {
    light: 'bg-weather-light-gradient',
    normal: 'bg-weather-normal-gradient',
    dark: 'bg-weather-dark-gradient',
    error: 'bg-weather-error-gradient',
  };

  return (
    <div
      className={`w-full h-[292px] relative ${
        backgroundStyle[isLoading ? 'normal' : isSuccess ? backgroundType : 'error']
      }`}
    >
      <div className="w-full h-full flex flex-col justify-center px-5">
        {!isLoading && (
          <>
            <Location {...location} size="l" color="white" />
            <div className="flex justify-between">
              <div>
                {isSuccess && (
                  <div className="flex flex-col gap-1">
                    <CurrentTemp>{currentTemp}</CurrentTemp>
                    <WeatherMessage size="l" color="white">
                      {weatherMessage}
                    </WeatherMessage>
                    <MinMaxTemps minTemp={minTemp} maxTemp={maxTemp} color="white" />
                  </div>
                )}
                {isError && (
                  <>
                    <p className="text-6xl text-white font-bold mt-5 mb-3">Error</p>
                    <button onClick={handleRefetch} className="underline text-s text-white ml-1">
                      재시도
                    </button>
                  </>
                )}
              </div>
              <WeatherImg weatherType={isSuccess ? (weatherType as string) : 'error'} width={206} height={169} />
            </div>
          </>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black opacity-20 flex justify-center items-center">
            <Spinner width={40} />
          </div>
        )}
      </div>
    </div>
  );
}
