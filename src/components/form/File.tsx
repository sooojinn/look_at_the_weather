import { FileProps, ImageItem, PostFormData } from '@/config/types';
import Text from '@components/common/atom/Text';
import ImgDeleteIcon from '@components/icons/ImgDeleteIcon';
import PlusIcon from '@components/icons/PlusIcon';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { showToast } from '@components/common/molecules/ToastProvider';
import { deleteImage } from '@/api/apis';
import axios from 'axios';
import { BASEURL } from '@/constants/constants';
import { useFormContext } from 'react-hook-form';
import Spinner from '@components/icons/Spinner';
import { useDeletedImagesStore } from '@/store/deletedImagesStroe';

interface PreviewImageProps extends ImageItem {
  onDelete: (id: number) => void;
  classNames: string;
}

interface AddImageBtnProps {
  handleAddClick: () => void;
  classNames: string;
}

// 이미지 업로드 함수
const uploadImage = async (file: File): Promise<{ id: number }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${BASEURL}/s3/post-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export default function File({ name, rules, defaultImageIds }: FileProps) {
  const { register, getValues, setValue } = useFormContext<PostFormData>();
  const { deletedDefaultImageIds, setDeletedDefaultImageIds, reset } = useDeletedImagesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 3;

  const removeImageAndId = (id: number) => {
    const updatedImages = getValues('images').filter((img) => img.imageId !== id);
    const updatedImageIds = getValues('imageIds').filter((imageId) => imageId !== id);
    setValue('images', updatedImages);
    setValue(name, updatedImageIds, { shouldDirty: true, shouldValidate: true });
  };

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data, file) => {
      const existingFiles = getValues('images') || [];
      const existingImageIds = existingFiles.map((file) => file.imageId);
      const newFile = { imageId: data.id, url: URL.createObjectURL(file) };
      setValue('images', [...existingFiles, newFile]);
      setValue(name, [...existingImageIds, newFile.imageId], { shouldDirty: true, shouldValidate: true });
    },
    onError: (error) => {
      showToast('이미지 업로드 실패. 다시 시도해주세요.');
      console.error('이미지 업로드에 실패했습니다:', error);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: (_, id) => removeImageAndId(id),
    onError: (error) => {
      showToast('이미지 삭제 실패. 다시 시도해주세요.');
      console.error('이미지 삭제에 실패했습니다:', error);
    },
  });

  // 이미지 업로드 시 실행되는 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        uploadImageMutation.mutate(file);
      });
      e.target.value = '';
    }
  };

  // 특정 이미지를 삭제하는 함수
  const handleDeleteImage = async (id: number) => {
    // 기존의 이미지면 api를 보내지 않고 배열에 저장
    if (defaultImageIds.includes(id)) {
      setDeletedDefaultImageIds([...deletedDefaultImageIds, id]);
      removeImageAndId(id);
      return;
    }
    deleteImageMutation.mutate(id);
  };

  useEffect(() => {
    return () => {
      reset(); // 언마운트 시 deletedDefaultImageIds 값 초기화
    };
  }, [reset]);

  const previewImageStyle = 'w-[158px] flex-shrink-0 flex justify-center items-center bg-background-light';

  return (
    <>
      <div className="h-[197px] flex space-x-2 overflow-auto scrollbar-hide">
        {(getValues('images') || []).map((image) => {
          const { imageId, url } = image;
          return (
            <PreviewImage
              key={imageId}
              imageId={imageId}
              url={url}
              onDelete={handleDeleteImage}
              classNames={previewImageStyle}
            />
          );
        })}
        {uploadImageMutation.isPending && (
          <div className={previewImageStyle}>
            <Spinner width={20} />
          </div>
        )}
        {(getValues('images') || []).length < MAX_IMAGES && (
          <AddImageBtn handleAddClick={() => fileInputRef.current?.click()} classNames={previewImageStyle} />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        {...register(name, rules)}
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
    </>
  );
}

function PreviewImage({ imageId, url, onDelete, classNames }: PreviewImageProps) {
  return (
    <div className={`${classNames} relative`}>
      <img src={url} alt={`사진 ${imageId}`} className="w-full h-full object-cover" />
      <ImgDeleteIcon id={imageId} onDelete={onDelete} />
    </div>
  );
}

function AddImageBtn({ handleAddClick, classNames }: AddImageBtnProps) {
  return (
    <div className={`${classNames} cursor-pointer`} onClick={handleAddClick}>
      <div className="flex flex-col justify-center items-center gap-[2px]">
        <PlusIcon />
        <Text color="gray">사진 추가</Text>
      </div>
    </div>
  );
}
