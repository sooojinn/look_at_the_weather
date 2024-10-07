import { uploadPost } from '@/api/apis';
import { PostFormData } from '@/config/types';
import useLocationData from '@/hooks/useLocationData';
import { showToast } from '@components/common/molecules/ToastProvider';
import PostForm from '@components/form/PostForm';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function PostWrite() {
  const { location: currentLocation } = useLocationData();

  const navigate = useNavigate();

  const defaultValues = {
    title: '',
    content: '',
    city: currentLocation?.city || '',
    district: currentLocation?.district || '',
    weatherTagIds: [],
    temperatureTagIds: [],
    seasonTagId: null,
    imageIds: [],
    images: [],
  };

  const uploadMutation = useMutation({
    mutationFn: uploadPost,
    onSuccess: () => {
      navigate(-1);
      showToast('게시물이 등록되었습니다');
    },
    onError: (error) => {
      console.error(error);
      showToast('게시물을 등록하는 데 실패했습니다.');
    },
  });

  const onSubmit = (data: PostFormData) => {
    uploadMutation.mutate(data);
  };

  return <PostForm type="작성" defaultValues={defaultValues} onSubmit={onSubmit} />;
}
