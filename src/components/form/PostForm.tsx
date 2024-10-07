import Text from '@components/common/atom/Text';
import Label from '@components/form/Label';
import Location from '@components/common/molecules/LocationComponent';
import { FormProvider, useForm } from 'react-hook-form';
import SelectWithLabel from '@components/form/SelectWithLabel';
import TextAreaWithLabel from '@components/form/TextAreaWithLabel';
import { PostFormData } from '@/config/types';
import FileWithLabel from './FileWithLabel';
import { useEffect, useState } from 'react';
import ExitWarningModal from '@components/common/organism/WarningModal';
import Header from '@components/common/Header';
import { useNavigate } from 'react-router-dom';
import { SEASON_TAGS, TEMPERATURE_TAGS, WEATHER_TAGS } from '@/config/constants';
import Button from '@components/common/molecules/Button';
import MarkdownRenderer from '@components/common/organism/MarkdownRenderer';
import { useGeoLocationStore } from '@/store/locationStore';

interface PostWriteFormProps {
  type: '작성' | '수정';
  defaultValues: PostFormData;
  onSubmit: (data: PostFormData) => void;
}

export default function PostForm({ type, defaultValues, onSubmit }: PostWriteFormProps) {
  const formMethods = useForm<PostFormData>({
    defaultValues: { ...defaultValues },
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
  } = formMethods;

  const postFormLocation = useGeoLocationStore((state) => state.postFormLocation);
  const setPostFormLocation = useGeoLocationStore((state) => state.setPostFormLocation);
  const { city, district } = postFormLocation || defaultValues;

  setValue('city', city);
  setValue('district', district);

  const [shoWModal, setShoWModal] = useState(false);
  const navigate = useNavigate();

  const handleFormCloseBtn = () => {
    if (isDirty) setShoWModal(true);
    else navigate(-1);
  };

  // 주소 검색 페이지로 이동하면 작성 중인 내용 세션 스토리지에 저장
  const handleSaveToSessionStorage = () => {
    const formData = getValues();
    sessionStorage.setItem('formData', JSON.stringify(formData));
  };

  // 페이지가 처음 로드될 때 세션 스토리지에서 저장된 데이터 불러오기
  useEffect(() => {
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      const parsedData: PostFormData = JSON.parse(savedData);
      (Object.keys(parsedData) as Array<keyof PostFormData>).forEach((name) => {
        setValue(name, parsedData[name]);
      });
      sessionStorage.removeItem('formData');
    }
  }, []);

  return (
    <>
      <Header onClose={handleFormCloseBtn} showBackBtn={false}>
        게시글 {type}하기
      </Header>
      {shoWModal && (
        <ExitWarningModal
          mainMessage={`${type}하지 않고 나가시겠어요?`}
          subMessage={`지금까지 ${type}한 내용은 삭제됩니다.`}
          buttons={
            <>
              <Button type="sub" size="m" onClick={() => setShoWModal(false)}>
                닫기
              </Button>
              <Button
                type="main"
                size="m"
                onClick={() => {
                  navigate(-1);
                  setPostFormLocation(null);
                  sessionStorage.removeItem('formData');
                }}
              >
                나가기
              </Button>
            </>
          }
        />
      )}
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-5 pb-10 flex flex-col gap-5">
            <FileWithLabel
              name="imageIds"
              label="오늘의 룩을 올려주세요"
              description="사진 추가는 최대 3장까지 가능합니다."
              rules={{ required: true }}
              defaultImageIds={defaultValues.imageIds}
            />
            <div className="flex flex-col gap-4">
              <Text size="l" weight="bold">
                내용을 작성해주세요
              </Text>
              <TextAreaWithLabel
                name="title"
                label="제목"
                placeholder="제목을 입력해 주세요."
                rules={{ required: true }}
                maxLength={30}
                className="h-[86px]"
              />
              <TextAreaWithLabel
                name="content"
                label="내용"
                placeholder="내용을 입력해 주세요."
                maxLength={300}
                className="h-[238px]"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label size="l">위치</Label>
              <div onClick={handleSaveToSessionStorage}>
                <Location isPostFormLocation city={city} district={district} />
              </div>
            </div>
            <SelectWithLabel
              label="해당 코디를 입었을 때 날씨를 알려주세요"
              description="최대 2개까지 선택 가능합니다."
              name="weatherTagIds"
              options={WEATHER_TAGS}
              rules={{ required: true }}
              maxSelection={2}
            />
            <SelectWithLabel
              label="온도"
              description="최대 2개까지 선택 가능합니다."
              name="temperatureTagIds"
              options={TEMPERATURE_TAGS}
              rules={{ required: true }}
              maxSelection={2}
            />
            <SelectWithLabel label="계절" name="seasonTagId" options={SEASON_TAGS} rules={{ required: true }} />
          </div>
          <div className="bg-background-light p-5 pb-10">
            <div className="flex flex-col gap-2 mb-10">
              <Text size="s" color="darkGray" weight="bold">
                게시글 작성 가이드
              </Text>
              <MarkdownRenderer markdownTitle="post-guide" size="xs" color="darkGray" />
            </div>
            <Button type="main" disabled={!isValid || !isDirty || isSubmitting}>
              {type === '작성' ? '업로드하기' : '수정하기'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
