import LocationComponent from '@components/common/molecules/LocationComponent';
import WeatherMessage from './WeatherMessage';
import MinMaxTemps from './MinMaxTemps';
import Text from '@components/common/atom/Text';
import WeatherImg from './WeatherImg';
import Spinner from '@components/icons/Spinner';
import useLocationData from '@/hooks/useLocationData';
import useWeatherData from '@/hooks/useWeatherData';

export default function LookWeatherInfo() {
  const { geoPoint, location, isLocationLoading, isLocationSuccess, isLocationError } = useLocationData();
  const { weatherData, isWeatherLoading, isWeatherSuccess, isWeatherError, handleRefetch } = useWeatherData(geoPoint);
  const { weatherMessage, weatherType, minTemp, maxTemp } = weatherData;

  const isLoading = isLocationLoading || isWeatherLoading;
  const isSuccess = isLocationSuccess && isWeatherSuccess;
  const isError = isLocationError || isWeatherError;
  return (
    <div className="h-[129px] flex justify-between py-5 relative">
      {!isLoading && (
        <>
          <div className="flex-grow flex flex-col gap-2.5">
            <LocationComponent {...location} size="m" />
            {isSuccess && (
              <>
                <WeatherMessage size="xl">{weatherMessage}</WeatherMessage>
                <MinMaxTemps minTemp={minTemp} maxTemp={maxTemp} color="gray" />
              </>
            )}
            {isError && (
              <>
                <Text size="2xl" weight="bold">
                  Error
                </Text>
                <div onClick={handleRefetch}>
                  <Text size="s" color="gray" weight="bold" className="underline cursor-pointer">
                    재시도
                  </Text>
                </div>
              </>
            )}
          </div>
          <WeatherImg weatherType={isSuccess ? (weatherType as string) : 'error'} width={134} height={110} />
        </>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner width={20} />
        </div>
      )}
    </div>
  );
}
