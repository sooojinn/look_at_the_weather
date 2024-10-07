import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputWithLabel from '@components/form/InputWithLabel';
import Button from '@components/common/molecules/Button';
import Text from '@components/common/atom/Text';
import KakaoLogin from './KakaoLogin';
import { setAccessToken, isLogin } from '@/api/instance';
import { postLogin } from '@/api/apis';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '@components/common/molecules/ToastProvider';
import { ErrorResponse } from '@/config/types';
import { AxiosError } from 'axios';

export default function LoginModal() {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setShowForm(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: ({ data }) => {
      const { accessToken, nickName } = data;
      setAccessToken(accessToken);
      localStorage.setItem('nickName', nickName);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data.errorCode === 'NOT_EXIST_EMAIL') {
        setError('email', { message: '이메일이 존재하지 않습니다.' });
      } else if (error.response?.data.errorCode === 'INVALID_PASSWORD') {
        setError('password', { message: '잘못된 비밀번호입니다.' });
      } else {
        console.error('로그인 실패: ', error);
        showToast('로그인 실패. 다시 시도해주세요.');
      }
    },
  });

  const handleLogin = async (data: any) => {
    loginMutation.mutate(data);
  };

  const linkList = [
    { path: '/signup', label: '회원가입', index: 1 },
    { path: '/find-email', label: '이메일 찾기', index: 2 },
    { path: '/find-password', label: '비밀번호 찾기', index: 3 },
  ];

  return (
    <>
      {!isLogin() ? (
        <div className="fixed inset-0 z-50 flex justify-center items-end">
          {/* 배경 흐리게 */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div
            className={`w-full max-w-md bg-white px-5 py-10 rounded-t-3xl z-20 transition-transform duration-500 ease-out ${
              showForm ? 'transform translate-y-0' : 'transform translate-y-full'
            }`}
          >
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <InputWithLabel
                  name="email"
                  label="이메일"
                  placeholder="(예시) abcde@naver.com"
                  register={register}
                  rules={{
                    required: '이메일을 입력해 주세요.',
                  }}
                  errors={errors}
                  setValue={setValue}
                />

                <InputWithLabel
                  name="password"
                  type="password"
                  label="비밀번호"
                  placeholder="영문/숫자/특수문자 2가지 이상 조합 (8-15자)"
                  register={register}
                  rules={{
                    required: '비밀번호를 입력해 주세요.',
                  }}
                  errors={errors}
                  setValue={setValue}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="main" onClick={handleSubmit(handleLogin)}>
                  이메일로 로그인
                </Button>
                <KakaoLogin />
              </div>
            </form>
            <div className="h-12 mt-6 flex justify-between">
              {linkList.map(({ path, label, index }) => (
                <Link key={index} to={path} className="w-[106px] flex justify-center items-center">
                  <Text weight="bold">{label}</Text>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
