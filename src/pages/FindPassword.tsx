import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { BASEURL } from '@/config/constants';
import Button from '@components/common/molecules/Button';
import InfoModal from '@components/common/organism/InfoModal';
import { useMutation } from '@tanstack/react-query';
import { ErrorResponse } from '@/config/types';
import EmailInput from '@components/form/inputs/EmailInput';
import NameInput from '@components/form/inputs/NameInput';
import NicknameInput from '@components/form/inputs/NicknameInput';

interface FindPasswordForm {
  email: string;
  name: string;
  nickname: string;
}

const findPassword = async (data: FindPasswordForm) => {
  const response = await axios.post(`${BASEURL}/users/password`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export default function FindPassword() {
  const formMethods = useForm<FindPasswordForm>();
  const { handleSubmit } = formMethods;

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const findPasswordMutation = useMutation({
    mutationFn: findPassword,
    onSuccess: ({ userId }) => {
      navigate('/password-reset', { state: { userId: userId } });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data.errorCode === 'NOT_EXIST_USER') {
        setShowModal(true);
      } else {
        console.error('비밀번호 찾기 오류: ', error);
      }
    },
  });

  const onSubmit = async (data: FindPasswordForm) => {
    findPasswordMutation.mutate(data);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header>비밀번호 찾기</Header>
      <form className="flex flex-col justify-between h-screen p-5 pb-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <EmailInput<FindPasswordForm> {...formMethods} />
          <NameInput<FindPasswordForm> {...formMethods} />
          <NicknameInput<FindPasswordForm> {...formMethods} />
        </div>
        <Button>비밀번호 찾기</Button>
      </form>
      {showModal && <InfoModal message="가입된 계정 정보가 없습니다." onClose={() => setShowModal(false)} />}
    </div>
  );
}
