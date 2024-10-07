import { GeoPoint, Location } from '@/config/types';
import { fetchCurrentGeoPoint, getLocationFromGeoPoint } from '@/lib/geo';
import { useGeoLocationStore } from '@/store/locationStore';
import { showToast } from '@components/common/molecules/ToastProvider';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useLocationPermission from './useLocationPermission';

// 서울시청의 위도와 경도
const defaultGeoPoint: GeoPoint = {
  latitude: 37.5663,
  longitude: 126.9779,
};

export const useGeoPointQuery = () => {
  const customGeoPoint = useGeoLocationStore((state) => state.customGeoPoint);
  const { isLocationAllowed } = useLocationPermission();

  const getGeoPoint = async () => {
    // store에 저장된 위치가 있는 경우(위치를 직접 설정한 경우)
    if (customGeoPoint) {
      return customGeoPoint;
    }

    // 위치 정보 접근 거부되어 있는 경우 서울시청의 위치 반환
    if (!isLocationAllowed) {
      console.warn('사용자가 위치 정보 접근을 거부했습니다.');
      return defaultGeoPoint;
    }

    // 그 외의 경우 geolocation api로 현재 위치 반환
    const currentGeoPoint = await fetchCurrentGeoPoint();
    return currentGeoPoint;
  };

  return useQuery({
    queryKey: ['geoPoint', customGeoPoint, isLocationAllowed],
    queryFn: getGeoPoint,
    staleTime: 0, // 컴포넌트가 마운트될 때마다 패칭
    gcTime: 0,
    enabled: isLocationAllowed !== undefined,
  });
};

// 위치 정보('OO시 OO구')를 패칭
export const useLocationQuery = (geoPoint: GeoPoint | undefined): UseQueryResult<Location | undefined, Error> =>
  useQuery({
    queryKey: ['location', geoPoint?.latitude, geoPoint?.longitude], // 의존성에 위도와 경도 추가 -> 위도와 경도 값이 바뀌면 리패칭
    queryFn: () => getLocationFromGeoPoint(geoPoint as GeoPoint),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    retry: 1,
    enabled: !!geoPoint,
  });

export default function useLocationData() {
  const geoPointQuery = useGeoPointQuery();
  const geoPoint = geoPointQuery.data;

  const locationQuery = useLocationQuery(geoPoint);
  const location = locationQuery.data;

  const isLocationLoading = geoPointQuery.isLoading || locationQuery.isLoading;
  const isLocationSuccess = geoPointQuery.isSuccess && locationQuery.isSuccess;
  const isLocationError = geoPointQuery.isError || locationQuery.isError;

  const handleRefetch = () => {
    if (geoPointQuery.isError) geoPointQuery.refetch();
    else if (locationQuery.isError) locationQuery.refetch();
    return;
  };

  useEffect(() => {
    if (isLocationError) {
      showToast('현재 위치 정보를 불러올 수 없어요.', '재시도', handleRefetch);
    }
  }, [isLocationError]);

  return { geoPoint, location, isLocationLoading, isLocationSuccess, isLocationError };
}
