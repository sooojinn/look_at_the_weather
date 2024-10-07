import { deleteImage, editPost } from '@/api/apis';
import { TAGS } from '@/config/constants';
import { ImageItem, PostFormData } from '@/config/types';
import { useDeletedImagesStore } from '@/store/deletedImagesStroe';
import { showToast } from '@components/common/molecules/ToastProvider';
import PostForm from '@components/form/PostForm';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

function tagNameToId(tagName: string) {
  const tag = TAGS.find((tag) => tagName === tag.name);
  return tag?.id as number;
}

function tagNamesToIds(tagNames: string[]) {
  return tagNames.map((tagName) => tagNameToId(tagName));
}

export default function PostEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postData, postId } = location.state;
  const deletedDefaultImageIds = useDeletedImagesStore((state) => state.deletedDefaultImageIds);

  postData;

  const {
    title,
    content,
    location: { city, district },
    weatherTags,
    temperatureTags,
    seasonTag,
    images,
  } = postData;

  const imageList = postData.images.image;
  const imageIds = imageList.map((img: ImageItem) => img.imageId);

  const defaultValues = {
    title,
    content,
    city,
    district,
    weatherTagIds: tagNamesToIds(weatherTags),
    temperatureTagIds: tagNamesToIds(temperatureTags),
    seasonTagId: tagNameToId(seasonTag),
    imageIds,
    images: images.image,
  };

  const editMutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      navigate(`/post/${postId}`, { state: { id: postId }, replace: true });
      showToast('게시물이 수정되었습니다.');
    },
    onError: (error) => {
      console.error(error);
      showToast('게시물을 수정하는 데 실패했습니다.');
    },
  });

  const deleteDefaultImageMutation = useMutation({
    mutationFn: deleteImage,
    onError: (error) => {
      console.error(error);
      showToast('게시물을 수정하는 데 실패했습니다.');
    },
  });

  const deleteDefaultImages = (imageIds: number[]) => {
    imageIds.forEach((id) => {
      deleteDefaultImageMutation.mutate(id);
    });
  };

  const onSubmit = (data: PostFormData) => {
    if (deletedDefaultImageIds.length) {
      deleteDefaultImages(deletedDefaultImageIds);
    }
    editMutation.mutate({ postId, data });
  };

  return <PostForm type="수정" defaultValues={defaultValues} onSubmit={onSubmit} />;
}
