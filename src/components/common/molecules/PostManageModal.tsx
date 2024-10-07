import { ReactNode, useEffect, useState } from 'react';
import CloseBtn from '@components/icons/CloseBtn';
import ReportIcon from '@components/icons/ReportIcon';
import HideIcon from '@components/icons/HideIcon';
import DeleteIcon from '@components/icons/DeleteIcon';
import EditIcon from '@components/icons/EditIcon';
import Text from '../atom/Text';
import { deletePost, hidePost } from '@/api/apis';
import { useNavigate } from 'react-router-dom';
import { PostDetail } from '@pages/PostDetail';
import { useMutation } from '@tanstack/react-query';
import { showToast } from './ToastProvider';
import WarningModal from '../organism/WarningModal';
import Button from './Button';

interface PostManageModalProps {
  modalController: React.Dispatch<React.SetStateAction<boolean>>;
  isMyPost?: boolean;
  postId: number;
  postData: PostDetail | undefined;
  isReported?: boolean;
}

export default function PostManageModal({
  modalController,
  isMyPost,
  postId,
  postData,
  isReported,
}: PostManageModalProps) {
  const navigate = useNavigate();
  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);

  const onClickCloseBtn = () => {
    modalController(false);
  };

  const hidePostMutation = useMutation({
    mutationFn: hidePost,
    onSuccess: () => {
      showToast('해당 게시물이 숨김 처리되었습니다.');
      navigate(-1);
    },
    onError: (error) => {
      showToast('게시물을 숨김 처리하는 데 실패했습니다.');
      modalController(false);
      console.error(error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      showToast('해당 게시물이 삭제되었습니다.');
      navigate(-1);
    },
    onError: (error) => {
      console.error(error);
      showToast('게시물을 삭제하는 데 실패했습니다.');
      modalController(false);
    },
  });

  // 수정하기
  const onClickUpdateBtn = async () => {
    navigate(`/post/${postId}/edit`, { state: { postData, postId } });
  };

  // 삭제하기
  const onClickDeleteBtn = async () => {
    setShowDeleteWarningModal(true);
  };

  // 숨기기
  const onClickHideBtn = () => {
    hidePostMutation.mutate(postId);
  };

  // 신고하기
  const onClickReportBtn = () => {
    navigate(`/post/${postId}/report`, { state: { postId } });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      {!showDeleteWarningModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
          <div className="max-w-md fixed bottom-0 w-full bg-background-white rounded-t-3xl z-20">
            <div className="h-14 pr-5 flex justify-end items-center">
              <CloseBtn onClick={onClickCloseBtn} />
            </div>
            <div className="pt-5 pb-10">
              {isMyPost ? (
                <>
                  {isReported || (
                    <PostMenuItem Icon={EditIcon} onClick={onClickUpdateBtn}>
                      수정하기
                    </PostMenuItem>
                  )}
                  <PostMenuItem Icon={DeleteIcon} onClick={onClickDeleteBtn}>
                    삭제하기
                  </PostMenuItem>
                </>
              ) : (
                <>
                  <PostMenuItem Icon={HideIcon} onClick={onClickHideBtn}>
                    해당 게시물 숨기기
                  </PostMenuItem>
                  <PostMenuItem Icon={ReportIcon} onClick={onClickReportBtn}>
                    신고하기
                  </PostMenuItem>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {showDeleteWarningModal && (
        <WarningModal
          mainMessage="게시물을 정말 삭제하시겠어요?"
          subMessage="삭제된 게시물은 복구되지 않아요."
          buttons={
            <div className="w-full flex gap-2">
              <Button type="sub" size="m" onClick={() => deletePostMutation.mutate(postId)}>
                삭제하기
              </Button>
              <Button type="main" size="m" onClick={() => setShowDeleteWarningModal(false)}>
                닫기
              </Button>
            </div>
          }
        />
      )}
    </>
  );
}

interface PostMenuItemProps {
  children: ReactNode;
  Icon: React.ComponentType;
  onClick: () => void;
}

function PostMenuItem({ children, Icon, onClick }: PostMenuItemProps) {
  return (
    <div className="flex gap-3 px-5 py-3 items-center hover:bg-background-light cursor-pointer" onClick={onClick}>
      <Icon />
      <Text size="l">{children}</Text>
    </div>
  );
}
