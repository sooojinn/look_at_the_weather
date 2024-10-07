import Text from '@components/common/atom/Text';

interface OptionBtnProps {
  name: string;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function OptionBtn({ name, selected, onClick }: OptionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 border rounded-[19px] transition-colors duration-200 ${
        selected ? 'border-primary-main' : 'border-line-lightest'
      }`}
    >
      <Text color={selected ? 'main' : 'lightGray'}>{name}</Text>
    </button>
  );
}
