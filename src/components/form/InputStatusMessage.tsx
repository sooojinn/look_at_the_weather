import Text from '@components/common/atom/Text';
import CheckIcon from '@components/icons/CheckIcon';
import { ReactNode } from 'react';

interface InputStatusMessageProps {
  children: ReactNode;
  status: 'success' | 'error' | 'normal';
  isVisible: boolean;
}

export default function InputStatusMessage({ children, status, isVisible }: InputStatusMessageProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-1 ml-1 flex items-center gap-1">
      {status === 'success' && <CheckIcon fill="#00BF40" width={12} />}
      <Text size="xs" color={status === 'success' ? 'success' : 'gray'}>
        {children}
      </Text>
    </div>
  );
}
