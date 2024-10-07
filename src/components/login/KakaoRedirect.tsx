import { BASEURL } from '@/config/constants';
import axios from 'axios';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Text from '@components/common/atom/Text';
import Spinner from '@components/icons/Spinner';
import { showToast } from '@components/common/molecules/ToastProvider';

const getUserInfo = async (code: string | null) => {
  const response = await axios.get(`${BASEURL}/oauth/kakao?code=${code}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export default function KakaoRedirect() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');

  const { data, isSuccess, error, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: () => getUserInfo(code),
    enabled: !!code,
  });

  useEffect(() => {
    if (isSuccess) {
      const { accessToken } = data;
      localStorage.setItem('accessToken', `Bearer ${accessToken}`);
      localStorage.setItem('nickName', data.nickName);

      navigate('/');
      window.location.reload();
    }

    if (error) {
      console.error('로그인에 실패했습니다:', error);
      showToast('카카오 로그인 실패. 다시 시도해 주세요.');
      navigate('/');
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative">
      {isLoading && (
        <div className="flex flex-col justify-center items-center gap-7">
          <Spinner width={60} />
          <Text color="black" weight="bold">
            잠시만 기다려 주세요..
          </Text>
        </div>
      )}
    </div>
  );
}
