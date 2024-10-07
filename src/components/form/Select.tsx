import { Controller, useFormContext } from 'react-hook-form';
import OptionBtn from '../common/molecules/OptionBtn';
import { PostFormData, SelectProps } from '@/config/types';

export default function Select({ name, options, maxSelection = 1, rules }: SelectProps) {
  const { control } = useFormContext<PostFormData>();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <div className="flex flex-wrap gap-2">
          {options.map(({ id, name }) => {
            return (
              <OptionBtn
                key={id}
                name={name}
                selected={isSelected(value, id)}
                onClick={(e) => {
                  handleOptionClick(e, value, id, maxSelection, onChange);
                }}
              />
            );
          })}
        </div>
      )}
    />
  );
}

function isSelected(value: any, id: number): boolean {
  // value가 배열(다중선택)일 때
  if (Array.isArray(value)) {
    return value.includes(id);
  }
  return value === id;
}

function handleOptionClick(
  e: React.MouseEvent<HTMLButtonElement>,
  value: any,
  id: number,
  maxSelection: number,
  onChange: (value: any) => void,
) {
  e.preventDefault();

  // 다중선택이 아닐 때
  if (maxSelection === 1) {
    onChange(value === id ? null : id);
    return;
  }

  // 다중선택일 때
  if (maxSelection > 1 && Array.isArray(value)) {
    if (value.includes(id)) {
      const newValue = value.filter((v) => v !== id);
      onChange(newValue);
    } else {
      const newValue = [...value, id];
      if (newValue.length > maxSelection) {
        newValue.shift();
      }
      onChange(newValue);
    }
  }
}
