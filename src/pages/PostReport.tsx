import { reportPost } from '@/api/apis';
import FooterNavi from '@components/common/FooterNavi';
import Header from '@components/common/Header';
import Text from '@components/common/atom/Text';
import { showToast } from '@components/common/molecules/ToastProvider';
import UnderlineOptionList from '@components/common/molecules/UnderlineOptionList';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PostReport() {
  const location = useLocation();
  const { postId } = location.state;
  const navigate = useNavigate();

  const reportReasons = [
    '관련 없는 내용이에요',
    '광고/홍보성 게시글이에요',
    '선정적이거나 폭력/혐오적인 내용이에요',
    '무단 도용, 사칭, 저작권 침해가 의심돼요',
    '개인 정보 노출이 우려돼요',
  ];

  const reportPostMutation = useMutation({
    mutationFn: reportPost,
    onSuccess: () => {
      showToast('해당 게시물 신고가 완료되었습니다.');
      navigate(-2);
    },
    onError: (error) => {
      showToast('게시물을 신고하는 데 실패했습니다.');
      navigate(-1);
      console.error(error);
    },
  });

  const handleReasonClick = (reason: string) => {
    reportPostMutation.mutate({ postId, reason });
  };

  return (
    <>
      <Header>신고하기</Header>
      <div className="p-5 pt-10 flex flex-col gap-3">
        <Text size="xl" weight="bold">
          해당 게시물을 신고하는
          <br />
          이유를 알려주세요.
        </Text>
        <Text color="gray">신고된 게시물은 자동 숨김처리 됩니다.</Text>
      </div>
      <UnderlineOptionList optionList={reportReasons} handleOptionClick={handleReasonClick} />
      <FooterNavi />
    </>
  );
}
