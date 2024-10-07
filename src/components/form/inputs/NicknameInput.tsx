import Button from '@components/common/molecules/Button';
import InputWithLabel from '../InputWithLabel';
import InputStatusMessage from '../InputStatusMessage';
import useSignupStore from '@/store/signupStore';
import { useCheckNicknameMutation } from '@/lib/signupMutations';
import { useEffect } from 'react';
import { FormMethods } from '@/config/types';
import { FieldValues, Path } from 'react-hook-form';

interface NicknameInputProps<T extends FieldValues> extends FormMethods<T> {
  shouldValidate?: boolean;
  defaultValue?: string;
  isDirty?: boolean;
}

export default function NicknameInput<T extends FieldValues>({
  defaultValue,
  shouldValidate,
  register,
  setValue,
  setError,
  clearErrors,
  getValues,
  watch,
  formState: { errors },
}: NicknameInputProps<T>) {
  const { isNicknameChecked, setIsNicknameChecked } = useSignupStore();
  const { mutate: checkNicknameMutation, isPending: isNicknamePending } = useCheckNicknameMutation<T>(
    setError,
    clearErrors,
  );

  const handleCheckNickname = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 패턴 유효성 검사 수동으로 실행
    const nickname = getValues('nickname' as Path<T>);
    const pattern = /^[a-zA-Z가-힣]{1,10}$/;

    if (!pattern.test(nickname)) {
      setError('nickname' as Path<T>, {
        type: 'pattern',
        message: '한/영 10자 이내(특수문자, 공백 불가)로 입력해 주세요.',
      });
      return;
    }

    checkNicknameMutation(nickname);
  };

  useEffect(() => {
    setIsNicknameChecked(false);

    return () => setIsNicknameChecked(false);
  }, [watch('nickname' as Path<T>)]);

  return (
    <div>
      <InputWithLabel
        name={'nickname' as Path<T>}
        label="닉네임"
        placeholder={shouldValidate ? '한/영 10자 이내, 특수문자, 공백 불가' : '닉네임을 입력해 주세요.'}
        register={register}
        rules={{
          required: '닉네임을 입력해 주세요.',
          ...(shouldValidate && {
            validate: () => isNicknameChecked || '닉네임 중복 확인을 해주세요.',
          }),
        }}
        maxLength={10}
        errors={errors}
        setValue={setValue}
        defaultValue={defaultValue ? defaultValue : ''}
        button={
          shouldValidate && (
            <Button
              size="m"
              width={90}
              disabled={!watch('nickname' as Path<T>) || isNicknameChecked}
              isSubmitting={isNicknamePending}
              onClick={handleCheckNickname}
            >
              {isNicknameChecked ? '확인 완료' : '중복 확인'}
            </Button>
          )
        }
      />
      <InputStatusMessage status="success" isVisible={isNicknameChecked}>
        사용 가능한 닉네임입니다.
      </InputStatusMessage>
    </div>
  );
}
