import { RegisterOptions, useFormContext } from 'react-hook-form';
import Label from '@components/form/Label';
import { PostFormData } from '@/config/types';
import { useEffect, useState } from 'react';
import Text from '@components/common/atom/Text';

type TextAreaFields = 'title' | 'content';

interface TextAreaWithLabelProps {
  name: TextAreaFields;
  label: string;
  placeholder: string;
  maxLength: number;
  rules?: RegisterOptions<PostFormData, TextAreaFields>;
  className?: string;
}

export default function TextAreaWithLabel({
  name,
  label,
  placeholder,
  maxLength,
  rules,
  className = '',
}: TextAreaWithLabelProps) {
  const { register, getValues } = useFormContext<PostFormData>();
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const defaultValue = getValues(name);
    setCharCount(defaultValue.length);
  }, [register, name]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <Label required={!!rules?.required}>{label}</Label>
      <textarea
        className={`textarea ${className}`}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(name, rules)}
        onChange={(e) => {
          register(name, rules).onChange(e); // react-hook-form의 register 함수 호출
          handleChange(e); // 글자 수 업데이트
        }}
      />
      <div className="absolute right-3 bottom-3">
        <Text size="xs" color="lightGray">
          {charCount}/{maxLength}
        </Text>
      </div>
    </div>
  );
}
