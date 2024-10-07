import { ReactNode } from 'react';
import Text from '../atom/Text';
import Button from '../molecules/Button';

interface InfoModalProps {
  message: ReactNode;
  onClose: () => void;
  onContinue?: () => void;
}

export default function InfoModal({ message, onClose, onContinue }: InfoModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 flex flex-col text-center gap-6 rounded-lg">
        <Text>{message}</Text>
        <div className="flex gap-2">
          <Button size="m" type={onContinue ? 'sub' : 'main'} onClick={onClose}>
            닫기
          </Button>
          {onContinue && (
            <Button size="m" onClick={onContinue}>
              확인
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
