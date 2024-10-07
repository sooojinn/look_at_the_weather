import { EmptyHeartIcon, RedHeartIcon } from '@components/icons/heartIcons';
import { AxiosError } from 'axios';
import { useState } from 'react';
import Text from './Text';
import { deleteLike, postLike } from '@/api/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../molecules/ToastProvider';
import { ErrorResponse } from '@/config/types';
import { PostDetail } from '@pages/PostDetail';

interface HeartProps {
  fill?: string;
  liked?: boolean;
  postId: number;
  hasUserNumber?: boolean;
  likedCount?: number;
}

export default function Heart({
  fill = 'white',
  liked = false,
  postId,
  hasUserNumber,
  likedCount: initialLikedCount,
}: HeartProps) {
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [likedCount, setLikedCount] = useState(initialLikedCount);
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return isLiked ? await deleteLike(postId) : await postLike(postId);
    },
    onSuccess: (res) => {
      setIsLiked((prev) => !prev);
      setLikedCount(res.data.likedCount);
      queryClient.setQueryData(['postDetail', postId], (oldData: PostDetail) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          likeByUser: !oldData.likeByUser,
          likedCount: res.data.likedCount,
        };
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        const { errorMessage } = error.response.data;
        console.error(errorMessage, error);
        showToast(`${errorMessage}`);
      } else {
        console.error('예상치 못한 에러가 발생했습니다.', error);
      }
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    toggleLikeMutation.mutate();
  };

  return (
    <div onClick={handleClick} className="flex row gap-x-2">
      {isLiked ? <RedHeartIcon /> : <EmptyHeartIcon fill={fill} />}
      {hasUserNumber && <Text color="lightGray">{likedCount || 0}</Text>}
    </div>
  );
}
