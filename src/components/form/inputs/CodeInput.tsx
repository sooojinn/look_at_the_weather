import useSignupStore from '@/store/signupStore';
import InputWithLabel from '../InputWithLabel';
import Button from '@components/common/molecules/Button';
import { useVerifyCodeMutation } from '@/lib/signupMutations';
import { FormMethods } from '@/config/types';
import { FieldValues, Path } from 'react-hook-form';

export default function CodeInput<T extends FieldValues>({
  register,
  setValue,
  setError,
  clearErrors,
  getValues,
  watch,
  formState: { errors },
}: FormMethods<T>) {
  const { isEmailVerified, isCodeSended } = useSignupStore();
  const { mutate: verifyCodeMutation, isPending: isVerifyingCode } = useVerifyCodeMutation<T>(setError, clearErrors);

  const handleVerifyCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = getValues('email' as Path<T>);
    const code = getValues('code' as Path<T>);
    verifyCodeMutation({ email, code });
  };

  return (
    <InputWithLabel<T>
      name={'code' as Path<T>}
      label="인증번호 확인"
      isDisabled={isEmailVerified}
      placeholder="인증번호를 입력해 주세요."
      register={register}
      rules={{
        required: '인증번호를 입력해 주세요.',
        validate: () => isEmailVerified || '이메일 인증을 완료해 주세요.',
      }}
      errors={errors}
      setValue={setValue}
      button={
        <Button
          size="m"
          width={123}
          disabled={!isCodeSended || !watch('code' as Path<T>) || isEmailVerified}
          isSubmitting={isVerifyingCode}
          onClick={handleVerifyCode}
        >
          {isEmailVerified ? '확인 완료' : '인증번호 확인'}
        </Button>
      }
    />
  );
}
