import { useEffect } from 'react';
import InputStatusMessage from '../InputStatusMessage';
import InputWithLabel from '../InputWithLabel';
import { FormMethods } from '@/config/types';
import { FieldValues, Path } from 'react-hook-form';

export default function PasswordCheckInput<T extends FieldValues>({
  register,
  setValue,
  watch,
  getValues,
  trigger,
  formState: { errors },
}: FormMethods<T>) {
  useEffect(() => {
    if (getValues('confirmPassword' as Path<T>)) trigger('confirmPassword' as Path<T>);
  }, [watch('password' as Path<T>), watch('confirmPassword' as Path<T>)]);

  return (
    <div>
      <InputWithLabel
        name={'confirmPassword' as Path<T>}
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 한 번 더 입력해 주세요."
        register={register}
        rules={{
          required: '비밀번호를 다시 입력해 주세요.',
          validate: (value) => value === watch('password' as Path<T>) || '비밀번호가 일치하지 않습니다',
        }}
        errors={errors}
        setValue={setValue}
      />
      <InputStatusMessage
        status="success"
        isVisible={
          !!watch('confirmPassword' as Path<T>) && watch('confirmPassword' as Path<T>) === watch('password' as Path<T>)
        }
      >
        비밀번호가 일치합니다.
      </InputStatusMessage>
    </div>
  );
}
