import Text from '@components/common/atom/Text';
import Label from './Label';
import File from './File';
import { FileProps } from '@/config/types';

interface FileWithLabelProps extends FileProps {
  label: string;
  description: string;
}

export default function FileWithLabel({ name, label, description, rules, defaultImageIds }: FileWithLabelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label size="l" required={!!rules?.required}>
          {label}
        </Label>
        <Text size="s" color="lightGray">
          {description}
        </Text>
      </div>
      <File name={name} rules={rules} defaultImageIds={defaultImageIds} />
    </div>
  );
}
