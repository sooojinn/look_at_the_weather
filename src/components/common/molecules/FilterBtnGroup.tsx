import FilterBtn from '../atom/FilterBtnComp';
import { FilterBtnGroupProps } from '@/config/types';
import { v4 as uuidv4 } from 'uuid';

export default function FilterBtnGroup({ btnData, id, onClickFunc }: FilterBtnGroupProps) {
  const uuid = uuidv4();
  const btnId = id ? String(id) : uuid;

  return (
    <div className="flex flex-wrap row gap-2">
      {btnData.map((data) => (
        <FilterBtn id={btnId} onClickFunc={onClickFunc}>
          {data.name}
        </FilterBtn>
      ))}
    </div>
  );
}
