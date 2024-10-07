import { TextColor, TextSize } from '@/config/types';
import Text from '@components/common/atom/Text';
import CloseBtn from '@components/icons/CloseBtn';
import LocationIcon from '@components/icons/LocationIcon';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationComponentProps {
  isPostFormLocation?: boolean;
  city?: string;
  district?: string;
  size?: TextSize;
  color?: TextColor;
}

export default function LocationComponent({ isPostFormLocation, city, district, size, color }: LocationComponentProps) {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLocationClick = () => {
    navigate('/search-address', { state: { isPostFormLocation } });
  };

  useEffect(() => {
    const lastTooltipClosedDate = localStorage.getItem('lastTooltipClosedDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (!lastTooltipClosedDate || lastTooltipClosedDate !== currentDate) {
      setShowTooltip(true);
    }
  }, []);

  const handleTooltipClose = () => {
    setShowTooltip(false);
    const currentDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastTooltipClosedDate', currentDate);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-[6px] cursor-pointer" onClick={handleLocationClick}>
        <LocationIcon fill={color} />
        <Text size={size} color={color}>
          {city || district ? `${city} ${district}` : '위치 정보 없음'}
        </Text>
      </div>
      {showTooltip && <LocationTooltip onClose={handleTooltipClose} />}
    </div>
  );
}

function LocationTooltip({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute -top-10 -left-2 flex gap-2 px-3 py-2 bg-primary-main rounded-md z-10">
      <Text size="xs" color="white">
        위치를 변경하려면 클릭해 주세요
      </Text>
      <CloseBtn width={16} fill="white" onClick={onClose} />
      <div className="absolute bottom-[-5px] left-[10px] w-0 h-0 border-primary-main border-t-[5px] border-r-[5px] border-r-transparent border-l-[5px] border-l-transparent"></div>
    </div>
  );
}
