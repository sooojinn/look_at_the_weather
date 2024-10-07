import axios from 'axios';
import { SERVICE_KEY, TAGS, WEATHER_API_URL } from '../config/constants';
import { GeoPoint, WeatherInfo } from '@/config/types';
import { dfs_xy_conv } from './geo';

interface WeatherApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: ForecastItem[] | undefined;
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

interface ForecastItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

interface FilterCategories {
  [key: string]: { name: string };
}

interface ForecastType {
  filterCategories: FilterCategories;
  filterForecast(items: ForecastItem[], category: string): ForecastItem | undefined;
}

type WeatherType = 'clear' | 'hot' | 'partly_cloudy' | 'cloudy' | 'rain' | 'snow' | 'sleet';

// 태그 id를 name으로 변경하는 함수
export function getTagNameById(id: number | string) {
  const tag = TAGS.find((tag) => tag.id === id);
  return tag ? tag.name : null;
}

function getCurrentDateInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const fcstDate = `${year}${month}${day}`; // 예보 날짜(현재 날짜)
  const fcstTime = `${hours.toString().padStart(2, '0')}00`; // 예보 시각(현재 시각)

  return { now, hours, minutes, fcstDate, fcstTime };
}

// 시간별 예보 (기온, 하늘 상태, 강수 형태)
const hourly: ForecastType = {
  filterCategories: {
    TMP: { name: 'currentTemp' }, // 기온
    SKY: { name: 'sky' }, // 하늘 상태
    PTY: { name: 'precipType' }, // 강수 형태
  },

  filterForecast(items: ForecastItem[], category: string) {
    const { fcstDate, fcstTime } = getCurrentDateInfo();
    // 응답 받은 데이터 중 카테고리, 예보 날짜, 예보 시각이 일치하는 데이터 반환
    return items.find((item) => item.category === category && item.fcstDate === fcstDate && item.fcstTime === fcstTime);
  },
};

// 일별 예보 (일 최저기온, 일 최고기온)
const daily: ForecastType = {
  filterCategories: {
    TMN: { name: 'minTemp' }, // 일 최저기온
    TMX: { name: 'maxTemp' }, // 일 최고기온
  },

  filterForecast(items: ForecastItem[], category: string) {
    const { fcstDate } = getCurrentDateInfo();
    // 응답 받은 데이터 중 카테고리, 예보 날짜가 일치하는 데이터 반환(일 최저/최고기온은 예보 시각이 무의미)
    return items.find((item) => item.category === category && item.fcstDate === fcstDate);
  },
};

// 현재 위치의 nx. ny 좌표를 구함
async function getGrid(geoPoint: GeoPoint) {
  const { x: nx, y: ny } = dfs_xy_conv('toXY', geoPoint.latitude, geoPoint.longitude);

  return { nx, ny };
}

// 시간별 예보의 base_time(발표 시각)을 구하는 함수
function getHourlyForecastBaseTime() {
  const { hours } = getCurrentDateInfo();
  // 예보 발표 시각 (매일 3시간 간격)
  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  // 발표 시각은 현재 시각보다 작은 값 중 가장 큰 값
  // 발표 자료엔 발표 시각의 1시간 이후부터의 데이터가 있기 때문에 현재 시각과 발표 시각이 같으면 안 됨
  // ex. 5시 발표 자료에는 6시 이후부터의 데이터가 있음. 따라서 현재 시각이 5시 mm분일 때는 2시 발표 자료 중 예보 시각이 5시인 데이터가 가장 최신 데이터임.
  const baseTime =
    baseTimes.reverse().find((time) => {
      return hours > time;
    }) || 23;

  return baseTime.toString().padStart(2, '0') + '00'; // HH00 형태
}

// 일별 예보의 base_time(발표 시각)을 구하는 함수
function getDailyForecastBaseTime() {
  const { hours, minutes } = getCurrentDateInfo();
  // 00:00 ~ 02:10는 전날의 23시 발표 자료를, 02:11 ~ 23:59는 당일의 2시 발표 자료를 패칭함
  // 당일의 일 최저기온 데이터는 2시에 발표되는 게 마지막, 그 이후의 시각에 발표되는 자료부터는 익일의 최저기온 데이터밖에 없음
  // 2시 발표 자료는 2시 10분 이후부터 api로 접근 가능
  return hours < 2 || (hours === 2 && minutes <= 10) ? '2300' : '0200';
}

// base_date(발표 날짜)를 구하는 함수
function getBaseDate(baseTime: string): string {
  const { now } = getCurrentDateInfo();

  // 발표 시각이 23시면 하루 전 날짜로
  if (baseTime === '2300') {
    now.setDate(now.getDate() - 1);
  }

  return (
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') // YYYYMMDD 형태
  );
}

// 단기예보 api로 현재 위치의 날씨 데이터를 받아옴
export async function getWeatherForecasts(baseTime: string, geoPoint: GeoPoint): Promise<ForecastItem[] | undefined> {
  const baseDate = getBaseDate(baseTime);

  const { nx, ny } = await getGrid(geoPoint);

  try {
    const response = await axios.get<WeatherApiResponse>(WEATHER_API_URL, {
      params: {
        ServiceKey: SERVICE_KEY,
        pageNo: 1,
        numOfRows: 200,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: nx,
        ny: ny,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 에러 발생 시 에러 메시지 출력
    if (!response.data.response.body) {
      throw new Error(`${response.data.response.header.resultMsg}`);
    }

    // 예보 데이터 반환
    const items = response.data.response.body.items.item;
    return items;
  } catch (error) {
    console.error('Weather API 요청 실패:', error);
    throw error;
  }
}

// 응답 받은 예보 데이터 중 필요한 항목만 추출
function extractWeatherInfo(forecastType: ForecastType, items: ForecastItem[]) {
  const categories = forecastType.filterCategories;

  const weatherInfo: WeatherInfo = {};

  for (const category in categories) {
    const filteredItem = forecastType.filterForecast(items, category);
    const value = filteredItem?.fcstValue;

    const categoryInfo = forecastType.filterCategories[category];
    weatherInfo[categoryInfo.name] = value ? parseInt(value) : null;
  }
  return weatherInfo;
}

// 하늘 상태와 강수 형태로 날씨 타입 결정
function getWeatherType(sky: number, precipType: number): WeatherType {
  switch (precipType) {
    case 1:
    case 4:
      return 'rain';
    case 2:
      return 'sleet';
    case 3:
      return 'snow';
    default:
      switch (sky) {
        case 1:
          return 'clear';
        case 3:
          return 'partly_cloudy';
        case 4:
          return 'cloudy';
        default:
          return 'partly_cloudy';
      }
  }
}

// 기온, 하늘 상태, 강수 형태로 날씨에 맞게 문구 작성
function getWeatherMessage(currentTemp: number, sky: number, precipType: number) {
  // 강수 형태 체크
  if (precipType > 0) {
    switch (precipType) {
      case 1:
        return '비가 내리는 날이에요!';
      case 2:
        return '눈/비가 내리는 날이에요!';
      case 3:
        return '눈이 내리는 날이에요!';
      case 4:
        return '소나기가 오는 날이에요!';
    }
  }

  // 기온 체크
  if (currentTemp <= 0) {
    return '매우 추운 날이에요!';
  } else if (currentTemp > 30) {
    return '매우 더운 날이에요!';
  } else if (currentTemp > 0 && currentTemp <= 10) {
    // 쌀쌀한 경우 하늘 상태 체크
    let skyCondition = '';
    switch (sky) {
      case 1:
        skyCondition = '하늘이 맑은 날이에요!';
        break;
      case 3:
        skyCondition = '구름이 많은 날이에요!';
        break;
      case 4:
        skyCondition = '날씨가 흐린 날이에요!';
        break;
    }
    return `쌀쌀하고 ${skyCondition}`;
  }

  // 나머지 경우 하늘 상태만 체크
  switch (sky) {
    case 1:
      return '하늘이 맑은 날이에요!';
    case 3:
      return '구름이 많은 날이에요!';
    case 4:
      return '날씨가 흐린 날이에요!';
    default:
      return '';
  }
}

// 시간별 날씨 정보(기온, 하늘 상태, 강수 형태)를 얻는 함수
export async function getHourlyWeatherInfo(geoPoint: GeoPoint) {
  const baseTime = getHourlyForecastBaseTime();
  const forecasts = await getWeatherForecasts(baseTime, geoPoint);

  if (!forecasts) return;

  const weatherInfo = extractWeatherInfo(hourly, forecasts);
  const { currentTemp, sky, precipType } = weatherInfo;

  weatherInfo.weatherType = getWeatherType(sky, precipType);
  weatherInfo.weatherMessage = getWeatherMessage(currentTemp, sky, precipType);

  return weatherInfo;
}

// 일별 날씨 정보(일 최저기온, 일 최고기온)를 얻는 함수
export async function getDailyWeatherInfo(geoPoint: GeoPoint) {
  const baseTime = getDailyForecastBaseTime();
  const forecasts = await getWeatherForecasts(baseTime, geoPoint);

  if (!forecasts) return;

  const weatherInfo = extractWeatherInfo(daily, forecasts);

  return weatherInfo;
}
