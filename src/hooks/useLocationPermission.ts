import { useEffect, useState } from 'react';

export default function useLocationPermission() {
  const [isLocationAllowed, setLocationAllowed] = useState<boolean>(true);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

        // 초기 권한 상태 확인
        if (permissionStatus.state === 'granted') {
          setLocationAllowed(true);
        } else {
          setLocationAllowed(false);
        }

        // 권한 상태가 변경되면 자동으로 감지
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            setLocationAllowed(true);
          } else {
            setLocationAllowed(false);
          }
        };
      } catch (error) {
        console.error('위치 권한 확인 에러: ', error);
        setLocationAllowed(false);
      }
    };

    checkLocationPermission(); // 컴포넌트가 마운트될 때 권한을 확인
  }, [setLocationAllowed]);

  return { isLocationAllowed };
}
