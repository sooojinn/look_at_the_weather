import { HrLineHeight } from '@/config/types';

export default function VeLine({ height }: HrLineHeight) {
  const veHeight = height === 1 ? 'h-[1px]' : 'h-[16px]';
  return <div className={`${veHeight} w-0 border-l border-line-lightest`} />;
}
