import { FieldErrors, FieldValues, Path, RegisterOptions, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import Label from '@components/form/Label';
import { ReactNode, useEffect, useState } from 'react';
import PasswordToggleBtn from '@components/icons/PasswordToggleBtn';
import ErrorMessage from './ErrorMessage';
import InputDeleteBtn from '@components/icons/InputDeleteBtn';
import SearchIcon from '@components/icons/SearchIcon';

interface InputWithLabelProps<T extends FieldValues> {
  name: Path<T>;
  type?: 'text' | 'password';
  label?: string;
  isDisabled?: boolean;
  placeholder?: string;
  search?: boolean;
  maxLength?: number;
  button?: ReactNode;
  rules?: RegisterOptions<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
  defaultValue?: string;
}

export default function InputWithLabel<T extends FieldValues>({
  name,
  type = 'text',
  label,
  isDisabled,
  placeholder,
  search,
  maxLength,
  button,
  rules,
  register,
  setValue,
  defaultValue,
  errors,
}: InputWithLabelProps<T>) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setPasswordVisible(!isPasswordVisible);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setShowDeleteBtn(true);
    } else {
      setShowDeleteBtn(false);
    }
  };

  const handleDeleteClick = () => {
    setInputValue('');
    setShowDeleteBtn(false);
    setValue(name, '' as T[typeof name]);
  };

  const handleFocus = () => {
    if (inputValue) {
      setShowDeleteBtn(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDeleteBtn(false); // 포커스 아웃 시 삭제 버튼 숨김 (클릭 이벤트가 먼저 처리되도록 setTimeout 사용)
    }, 0);
  };

  useEffect(() => {
    if (defaultValue) setInputValue(defaultValue);
  }, [defaultValue]);

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;
  const hasError = !!errors?.[name];

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <Label required={!!rules?.required}>{label}</Label>}
      <div>
        <div className="flex">
          <div className="w-full relative">
            <input
              type={inputType}
              disabled={isDisabled}
              autoComplete="off"
              maxLength={maxLength}
              className={`input h-12 ${search ? '!pl-8' : ''} ${hasError ? '!border-status-error' : ''} ${
                isDisabled ? '!text-lightGray !bg-interactive-disabled' : ''
              } focus:pr-9`}
              placeholder={placeholder}
              {...register(name, {
                ...rules,
                onChange: handleInputChange,
              })}
              value={inputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {search && (
              <div className="absolute left-3 bottom-1/2 transform translate-y-1/2 flex items-center">
                <SearchIcon />
              </div>
            )}
            <div className="absolute right-3 bottom-1/2 transform translate-y-1/2 flex items-center">
              {type === 'password' && (
                <PasswordToggleBtn onToggle={togglePasswordVisibility} isVisible={isPasswordVisible} />
              )}
              {type !== 'password' && showDeleteBtn && <InputDeleteBtn onClick={handleDeleteClick} />}
            </div>
          </div>
          {button && <div className="ml-3">{button}</div>}
        </div>
        {hasError && <ErrorMessage<T> errors={errors} name={name} />}
      </div>
    </div>
  );
}
