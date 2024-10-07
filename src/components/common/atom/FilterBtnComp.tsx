import { ReactNode } from 'react';
import Text from './Text';
import { FilterBtn } from '@/config/types';
import SmallCloseBtn from '@components/icons/SmallCloseBtn';

type FilterBtnProps = FilterBtn & {
  children: ReactNode;
};

export default function FilterBtnComp({ children, id, onClickFunc, isActive, isSelected }: FilterBtnProps) {
  return (
    <button
      id={id}
      className={`border ${
        isActive ? 'border-primary-main' : 'border-line-lightest'
      } rounded-[19px] px-3 py-[5.5px] w-100 h-[32px] bg-background-white`}
      onClick={onClickFunc}
    >
      <div className="flex row gap-1 items-center">
        <Text color={`${isActive ? 'main' : 'gray'}`}>{children}</Text>
        <div>{isSelected ? <SmallCloseBtn /> : null}</div>
      </div>
    </button>
  );
}
