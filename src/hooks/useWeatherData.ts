import { useQuery } from '@tanstack/react-query';
import { GeoPoint } from '@/config/types';
import { getDailyWeatherInfo, getHourlyWeatherInfo } from '@/lib/weather';
import { showToast } from '@components/common/molecules/ToastProvider';
import { useEffect } from 'react';

const useHourlyWeatherQuery = (geoPoint: GeoPoint | undefined) =>
  useQuery({
    queryKey: ['hourlyWeather', geoPoint?.latitude, geoPoint?.longitude],
    queryFn: () => getHourlyWeatherInfo(geoPoint as GeoPoint),
    staleTime: calHourlyWeatherStaleTime(), // 매 정각에 리패칭
    gcTime: 1000 * 60 * 60,
    retry: 1,
    enabled: !!geoPoint,
  });

const useDailyWeatherQuery = (geoPoint: GeoPoint | undefined) =>
  useQuery({
    queryKey: ['dailyWeather', geoPoint?.latitude, geoPoint?.longitude],
    queryFn: () => getDailyWeatherInfo(geoPoint as GeoPoint),
    staleTime: calDailyWeatherStaleTime(), // 매일 2시 11분이 지나면 리패칭
    gcTime: 1000 * 60 * 60,
    retry: 1,
    enabled: !!geoPoint,
  });

export default function useWeatherData(geoPoint: GeoPoint | undefined) {
  const hourlyWeatherQuery = useHourlyWeatherQuery(geoPoint);
  const dailyWeatherQuery = useDailyWeatherQuery(geoPoint);

  const queries = [hourlyWeatherQuery, dailyWeatherQuery];

  const isWeatherLoading = queries.some((query) => query.isLoading);
  const isWeatherSuccess = queries.every((query) => query.isSuccess);
  const isWeatherError = !isWeatherLoading && queries.some((query) => query.isError);

  const handleRefetch = () => {
    queries.forEach((query) => {
      if (query.isError) query.refetch();
    });
  };

  useEffect(() => {
    if (isWeatherError) {
      showToast('현재 날씨 정보를 불러올 수 없어요.', '재시도', handleRefetch);
    }
  }, [isWeatherError]);

  return {
    weatherData: { ...hourlyWeatherQuery.data, ...dailyWeatherQuery.data },
    isWeatherLoading,
    isWeatherSuccess,
    isWeatherError,
    handleRefetch,
  };
}

function calHourlyWeatherStaleTime() {
  const now = new Date();
  const currentMinutes = now.getMinutes();

  // 현재 시간을 기준으로 다음 정각을 계산
  let nextRefetchTime = new Date(now);
  if (currentMinutes > 0) {
    // 다음 정각으로 설정 (현재 시간이 정각이 아니면 시간 +1)
    nextRefetchTime.setHours(nextRefetchTime.getHours() + 1);
  }
  nextRefetchTime.setMinutes(0, 0, 0); // 분, 초, 밀리초를 0으로 설정

  // 밀리초 단위로 차이 계산
  return nextRefetchTime.getTime() - now.getTime();
}

function calDailyWeatherStaleTime() {
  const now = new Date();

  // 다음 2시 11분을 계산하기 위해 날짜 설정
  const nextTargetTime = new Date();
  nextTargetTime.setHours(2, 11, 0, 0); // 2시 11분 00초로 설정

  // 현재 시간이 2시 11분 이후인 경우 다음 날 2시 11분으로 설정
  if (now > nextTargetTime) {
    nextTargetTime.setDate(nextTargetTime.getDate() + 1);
  }

  // staleTime을 밀리초 단위로 계산
  const staleTime = nextTargetTime.getTime() - now.getTime();

  return staleTime;
}
