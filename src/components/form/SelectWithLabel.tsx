import Label from './Label';
import Text from '@components/common/atom/Text';
import Select from './Select';
import { SelectProps } from '@/config/types';

interface SelectWithLabelProps extends SelectProps {
  label: string;
  description?: string;
}

export default function SelectWithLabel({
  label,
  description,
  name,
  options,
  rules,
  maxSelection,
}: SelectWithLabelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label size="l" required={!!rules?.required}>
          {label}
        </Label>
        {description && (
          <Text size="s" color="lightGray">
            {description}
          </Text>
        )}
      </div>
      <Select name={name} options={options} rules={rules} maxSelection={maxSelection} />
    </div>
  );
}
