import Text from '../atom/Text';

interface UnderlineOptionListProps {
  optionList: string[];
  handleOptionClick: (option: string) => void;
}

export default function UnderlineOptionList({ optionList, handleOptionClick }: UnderlineOptionListProps) {
  return (
    <>
      {optionList.map((option: string) => (
        <div
          key={option}
          onClick={() => handleOptionClick(option)}
          className="h-[60px] px-5 py-[18px] border-b border-line-light cursor-pointer hover:bg-background-light"
        >
          <Text size="l">{option}</Text>
        </div>
      ))}
    </>
  );
}
