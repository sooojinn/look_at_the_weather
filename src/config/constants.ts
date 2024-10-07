export const BASEURL = import.meta.env.VITE_BASE_URL;

export const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY;

export const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;

export const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export const REDIRECT_URI = 'http://localhost:5173/oauth';
export const TAGS = [
  { id: 1, category: 'weather', value: 'CLOUDY', name: '흐림' },
  { id: 2, category: 'weather', value: 'SUNNY', name: '맑음' },
  { id: 3, category: 'weather', value: 'SNOWY', name: '눈' },
  { id: 4, category: 'weather', value: 'RAINY', name: '비' },
  { id: 5, category: 'weather', value: 'WINDY', name: '바람' },
  { id: 6, category: 'temperature', value: 'HOT', name: '더워요' },
  { id: 7, category: 'temperature', value: 'COLD', name: '추워요' },
  { id: 8, category: 'temperature', value: 'WARM', name: '따뜻해요' },
  { id: 9, category: 'temperature', value: 'COOL', name: '쌀쌀해요' },
  { id: 10, category: 'temperature', value: 'MILD', name: '적당해요' },
  { id: 11, category: 'season', value: 'SPRING', name: '봄' },
  { id: 12, category: 'season', value: 'SUMMER', name: '여름' },
  { id: 13, category: 'season', value: 'FALL', name: '가을' },
  { id: 14, category: 'season', value: 'WINTER', name: '겨울' },
];

export const WEATHER_TAGS = TAGS.filter((tag) => tag.category === 'weather');
export const TEMPERATURE_TAGS = TAGS.filter((tag) => tag.category === 'temperature');
export const SEASON_TAGS = TAGS.filter((tag) => tag.category === 'season');

export const POSTFILTERTAPLIST = [
  {
    id: 0,
    tabName: '지역',
    href: '#location',
  },
  {
    id: 1,
    tabName: '날씨',
    href: '#weather',
  },
  {
    id: 2,
    tabName: '온도',
    href: '#temperature',
  },
  {
    id: 3,
    tabName: '계절',
    href: '#season',
  },
];
