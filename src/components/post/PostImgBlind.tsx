import { TextSize, TextWeight } from '@/config/types';
import Text from '@components/common/atom/Text';

interface PostImgBlindProps {
  textSize?: TextSize;
  textWeight?: TextWeight;
}

export default function PostImgBlind({ textSize, textWeight }: PostImgBlindProps) {
  return (
    <div className="w-full h-full bg-dimmer-bg flex flex-col justify-center items-center absolute">
      <Text size={textSize} weight={textWeight} color="white">
        신고로 인해
      </Text>
      <Text size={textSize} weight={textWeight} color="white">
        제제된 게시물입니다
      </Text>
    </div>
  );
}
