import WarningIcon from '@components/icons/WarningIcon';
import Text from '../atom/Text';
import { ReactNode } from 'react';

interface WarningModalProps {
  mainMessage: string;
  subMessage: ReactNode;
  detailMessage?: ReactNode;
  buttons?: ReactNode;
}

export default function WarningModal({ mainMessage, subMessage, detailMessage, buttons }: WarningModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      <div className="fixed inset-0 flex items-center justify-center z-20">
        <div className="min-w-[256px] p-6 flex flex-col bg-background-white rounded-xl z-20">
          <div className="flex flex-col justify-center items-center gap-4">
            <WarningIcon />
            <div className="flex flex-col items-center text-center gap-[6px]">
              <Text size="l" weight="bold">
                {mainMessage}
              </Text>
              <Text color="gray" className="flex flex-col gap-4">
                {subMessage}
              </Text>
              <Text size="xs" color="gray">
                {detailMessage}
              </Text>
            </div>
          </div>
          <div className="mt-6 flex justify-center items-center gap-2">{buttons}</div>
        </div>
      </div>
    </>
  );
}
