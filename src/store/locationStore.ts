import { GeoPoint, Location } from '@/config/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GeoLocationState {
  customGeoPoint: GeoPoint | null;
  postFormLocation: Location | null;
  setCustomGeoPoint: (customGeoPoint: GeoPoint | null) => void;
  setPostFormLocation: (postFormLocation: Location | null) => void;
}

export const useGeoLocationStore = create<GeoLocationState>()(
  devtools(
    (set) => ({
      customGeoPoint: null,
      postFormLocation: null,
      setCustomGeoPoint: (customGeoPoint: GeoPoint | null) => set({ customGeoPoint }),
      setPostFormLocation: (postFormLocation: Location | null) => set({ postFormLocation }),
    }),
    { name: 'Location Store' },
  ),
);
