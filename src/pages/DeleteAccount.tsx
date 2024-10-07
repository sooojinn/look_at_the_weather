import { deleteAccount, getDeleteReasons } from '@/api/apis';
import Header from '@components/common/Header';
import Text from '@components/common/atom/Text';
import Button from '@components/common/molecules/Button';
import { showToast } from '@components/common/molecules/ToastProvider';
import UnderlineOptionList from '@components/common/molecules/UnderlineOptionList';
import InfoModal from '@components/common/organism/InfoModal';
import WarningModal from '@components/common/organism/WarningModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  const { data: response } = useQuery({
    queryKey: ['deleteReasons'],
    queryFn: getDeleteReasons,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      setShowWarningModal(false);
      setShowDeleteSuccessModal(true);
    },
    onError: (error) => {
      console.error(error);
      showToast('탈퇴 처리 중 에러가 발생했습니다.');
      setShowWarningModal(false);
    },
  });

  const deleteReasons = response?.data;

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
    setShowWarningModal(true);
  };

  const handleDeleteClick = () => {
    deleteAccountMutation.mutate(selectedReason);
  };

  return (
    <div>
      <Header>회원 탈퇴</Header>
      <div className="p-5 pt-10 flex flex-col gap-3">
        <Text size="xl" weight="bold">
          룩엣더웨더를{' '}
          <Text size="xl" weight="bold" color="error" className="inline">
            탈퇴
          </Text>
          하시는
          <br /> 이유가 있을까요?
        </Text>
        <Text color="gray">
          탈퇴하시는 이유를 알려주시면, 더 나은 서비스를
          <br /> 만들기 위해 노력하겠습니다.
        </Text>
      </div>
      {deleteReasons && <UnderlineOptionList optionList={deleteReasons} handleOptionClick={handleReasonClick} />}
      {showWarningModal && (
        <WarningModal
          mainMessage="회원 탈퇴"
          subMessage={
            <>
              <p>
                회원 탈퇴 시 계정이 완전히 삭제되며,
                <br />
                삭제된 계정 정보는 복구가 불가능합니다.
                <br />
                또한 삭제 후 서비스를 이용하시려면
                <br />
                새로 가입하셔야 합니다.
              </p>
              <p>정말로 탈퇴하시겠습니까?</p>
            </>
          }
          buttons={
            <>
              <Button type="sub" size="m" onClick={() => setShowWarningModal(false)}>
                취소
              </Button>
              <Button type="main" size="m" onClick={handleDeleteClick}>
                탈퇴하기
              </Button>
            </>
          }
        />
      )}
      {showDeleteSuccessModal && (
        <InfoModal
          message={
            <p>
              탈퇴가 완료되었습니다.
              <br />
              그동안 이용해주셔서 감사합니다.
            </p>
          }
          onClose={() => navigate('/')}
        />
      )}
    </div>
  );
}
