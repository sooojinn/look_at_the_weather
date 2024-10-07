import Header from '@/components/common/Header';
import { BASEURL } from '@/config/constants';
import Button from '@components/common/molecules/Button';
import { showToast } from '@components/common/molecules/ToastProvider';
import InfoModal from '@components/common/organism/InfoModal';
import PasswordCheckInput from '@components/form/inputs/PasswordCheckInput';
import PasswordInput from '@components/form/inputs/PasswordInput';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

interface PasswordResetForm {
  userId: number;
  password: string;
  confirmPassword: string;
}

const passwordReset = async (data: PasswordResetForm) => {
  const { userId, password } = data;

  const response = await axios.patch(
    `${BASEURL}/users/password`,
    { userId, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export default function PasswordReset() {
  const formMethods = useForm<PasswordResetForm>({ mode: 'onChange' });
  const { handleSubmit, setValue, reset } = formMethods;

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;

  setValue('userId', userId);

  const passwordResetMutation = useMutation({
    mutationFn: passwordReset,
    onSuccess: () => setShowModal(true),
    onError: (error) => {
      console.error('비밀번호 재설정 실패: ', error);
      showToast('비밀번호 재설정에 실패했습니다.');
      reset();
    },
  });

  const onSubmit = async (data: PasswordResetForm) => {
    passwordResetMutation.mutate(data);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header>비밀번호 재설정</Header>
      <form className="flex flex-col justify-between h-screen p-5 pb-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <PasswordInput<PasswordResetForm> isPasswordReset {...formMethods} />
          <PasswordCheckInput<PasswordResetForm> {...formMethods} />
        </div>
        <Button>비밀번호 재설정하기</Button>
      </form>
      {showModal && (
        <InfoModal
          message="비밀번호 변경이 완료되었습니다."
          onClose={() => {
            setShowModal(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
}
