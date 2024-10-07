import { Cookies } from 'react-cookie';

export default function useCookie() {
  const cookies = new Cookies();

  const setCookie = (name: string, value: string, options?: any) => {
    return cookies.set(name, value, { ...options });
  };

  const getCookie = (name: string) => {
    return cookies.get(name);
  };

  return { setCookie, getCookie };
}
