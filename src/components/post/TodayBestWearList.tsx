import { PostList } from '@/components/post/PostList';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@components/icons/Spinner';
import Text from '@components/common/atom/Text';
import { fetchTopLikedPosts } from '@/api/apis';

export default function TodayBestWearList() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['topLikedPosts'],
    queryFn: fetchTopLikedPosts,
  });

  const topLikedPosts = response?.data.topLikedPosts;

  return (
    <div className="w-full max-w-md flex flex-col flex-grow">
      <div className="w-full px-5 flex justify-start items-center h-[60px]">
        <Text size="l" color="black" weight="bold">
          Today Best Wear 👕
        </Text>
      </div>
      {topLikedPosts && <PostList postList={topLikedPosts} />}
      {isLoading && (
        <div className="flex flex-grow justify-center items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
