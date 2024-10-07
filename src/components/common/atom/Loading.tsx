import Spinner from '@components/icons/Spinner';
import { forwardRef } from 'react';

// props에 isLoading을 포함시켜서 전달받도록 수정
interface LoadingProps {
  isLoading: boolean;
}

const Loading = forwardRef<HTMLDivElement, LoadingProps>(({ isLoading }, ref) => {
  return (
    <div ref={ref} className="flex justify-center my-10">
      {isLoading ? <Spinner /> : null}
    </div>
  );
});

export default Loading;
