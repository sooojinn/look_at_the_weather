import { TextColor, TextSize } from '@/config/types';
import Text from '@components/common/atom/Text';
import { ReactNode } from 'react';

interface WeatherMessageProps {
  children: ReactNode;
  size?: TextSize;
  color?: TextColor;
}

export default function WeatherMessage({ children, size, color }: WeatherMessageProps) {
  return (
    <Text size={size} color={color} weight="bold">
      {children}
    </Text>
  );
}
