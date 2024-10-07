import { PostList } from '@components/post/PostList';
import Header from '@components/common/Header';
import { getMyLikedPosts } from '@/api/apis';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Spinner from '@components/icons/Spinner';
import FooterNavi from '@components/common/FooterNavi';
import { showToast } from '@components/common/molecules/ToastProvider';


export default function MyLikedPost() {
  const { isFetchingNextPage, isLoading, isError, error, pageEndRef, postList } = useInfiniteScroll(
    ['myLikedPosts'],
    getMyLikedPosts,
    10,
  );

  if (isError) {
    console.error(error.message);
    showToast('내가 좋아요한 게시물을 불러오는 데 실패했습니다.');
  }

  return (
    <div className="pb-[61px]">
      <Header>내가 좋아요한 게시물</Header>
      <PostList postList={postList} />
      <div ref={pageEndRef}></div>
      {(isLoading || isFetchingNextPage) && (
        <div className="my-5 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <FooterNavi />
    </div>
  );
}
