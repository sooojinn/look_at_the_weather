import axios, { AxiosInstance } from 'axios';
import { BASEURL } from '@/constants/constants';
import { reissue } from './apis';

let accessToken: null | string = null;

const setAccessToken = (token: null | string) => {
  accessToken = `Bearer ${token}`;
  instance.defaults.headers.common['Authorization'] = accessToken;
};

const getAccessToken = () => {
  return accessToken;
};

const isLogin = () => {
  const token = getAccessToken();
  // const isAbleToken = token.length > 4;
  if (!token) {
    return false;
  } else {
    return true;
  }
};

export const instance: AxiosInstance = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: getAccessToken(),
    withCredentials: true,
  },
});

let reissueAttemptCount = 0;

// 인터셉터를 인스턴스에 적용
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('Interceptor caught an error:', error);

    if (error.response) {
      if (error.response.status === 401 && reissueAttemptCount < 3) {
        console.log('401 error detected, attempting to reissue token');
        reissueAttemptCount++;
        try {
          for (let i = 1; i <= 3; i++) {
            const response = await reissue();
            if (response.data.accessToken) {
              setAccessToken(response.data.accessToken);
              console.log(reissueAttemptCount);
              error.config.headers['Authorization'] = getAccessToken();
              return instance(error.config);
            } else {
              console.log(`${i}번째 토큰 재요청 실패`);
              setTimeout(() => {}, 500);
            }
          }
        } catch (reissueError) {
          console.log('Token reissue failed:', reissueError);
        }
      }
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      reissueAttemptCount = 0;
      console.log('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  },
);

export { setAccessToken, getAccessToken, isLogin };
