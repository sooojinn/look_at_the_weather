import { PostMeta } from '@/config/types';
import Tags from '@/components/post/Tags';
import Text from '@components/common/atom/Text';
import PostListImg from './PostListImg';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface PostListProps {
  postList: PostMeta[];
}

export function PostList({ postList }: PostListProps) {
  const navigate = useNavigate();

  const onClickPostHandler = (id: number) => {
    navigate(`/post/${id}`, { state: { id: id } });
  };

  return (
    <div className="w-full post-list">
      {postList.map((post) => {
        const {
          postId,
          thumbnail,
          likeByUser,
          location: { city, district },
          weatherTags,
          temperatureTags,
          seasonTag,
          reportPost,
        } = post;

        const tags = [...(weatherTags || []), ...(temperatureTags || []), seasonTag || ''];
        return (
          <div className="min-h-[312px] h-auto cursor-pointer" key={uuidv4()}>
            <div onClick={() => onClickPostHandler(postId)}>
              <PostListImg imgUrl={thumbnail} liked={likeByUser} postId={postId} isReported={reportPost} />
              <div className="mt-2.5 px-5">
                <Text>
                  {city} {district}
                </Text>
                <div>
                  <Tags tags={tags} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
