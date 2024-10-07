import { ReactNode } from 'react';

interface CurrentTempProps {
  children: ReactNode;
}

export default function CurrentTemp({ children }: CurrentTempProps) {
  return <div className="mt-2 text-white font-bold text-[100px] leading-none">{children}°</div>;
}
