import { FormMethods } from '@/config/types';
import InputWithLabel from '../InputWithLabel';
import { FieldValues, Path } from 'react-hook-form';

// NameInputProps를 제네릭 인터페이스로 선언
interface NameInputProps<T extends FieldValues> extends FormMethods<T> {
  shouldValidate?: boolean;
  isDisabled?: boolean;
}

// NameInput 컴포넌트도 제네릭으로 선언
export default function NameInput<T extends FieldValues>({
  shouldValidate,
  isDisabled,
  register,
  setValue,
  formState: { errors },
}: NameInputProps<T>) {
  return (
    <InputWithLabel
      name={'name' as Path<T>}
      label="이름"
      placeholder="이름(실명)을 입력해 주세요."
      isDisabled={isDisabled}
      register={register}
      rules={{
        required: '이름을 입력해 주세요.',
        ...(shouldValidate && {
          pattern: {
            value: /^[a-zA-Z가-힣]{1,10}$/,
            message: '한/영 10자 이내(특수문자, 공백 불가)로 입력해 주세요.',
          },
        }),
      }}
      maxLength={10}
      errors={errors}
      setValue={setValue}
    />
  );
}
