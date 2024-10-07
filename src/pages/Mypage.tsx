import { useEffect, useState } from 'react';
import FooterNavi from '@/components/common/FooterNavi';
import Header from '@components/common/Header';
import Text from '@components/common/atom/Text';
import { Line } from '@components/common/atom/Line';
import LinkMenu from '@/components/common/molecules/LinkMenu';
import { getUserInfos, postLogout } from '@/api/apis';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '@components/common/molecules/ToastProvider';
import InfoModal from '@components/common/organism/InfoModal';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '@/api/instance';

export default function Mypage() {
  const settingList = [{ menu: '내 정보 수정', href: '/profileedit' }];
  const activeList = [
    { menu: '내 게시물', href: '/mypost' },
    { menu: '내가 좋아요한 게시물', href: '/like' },
  ];

  const [userNickname, setUserNickname] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserNickname = async () => {
      const response = await getUserInfos();

      setUserNickname(response.data.nickname);
    };
    getUserNickname();
  }, []);

  const LogoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      setAccessToken(null);
      navigate('/');
    },
    onError: (error) => {
      showToast('로그아웃 실패. 다시 시도해주세요.');
      console.error(error);
    },
  });

  const handleLogoutClick = () => {
    LogoutMutation.mutate();
  };

  return (
    <>
      <Header>마이 페이지</Header>
      <div className="relative flex-col py-9">
        <div className="flex gap-3 items-center mb-6 px-5">
          <img src="../../public/assets/user_icon.png" alt="" />
          <Text size="xl" weight="bold">
            {userNickname}
          </Text>
        </div>
        <LinkMenu title="설정" menuList={settingList} />
        <Line height={8} />
        <LinkMenu title="활동" menuList={activeList} />
        <Line height={8} />
        <div className="h-[57px] flex items-center px-5">
          <div onClick={() => setShowLogoutModal(true)}>
            <Text className="cursor-pointer">로그아웃</Text>
          </div>
        </div>
      </div>
      <FooterNavi />
      {showLogoutModal && (
        <InfoModal
          message="정말 로그아웃 하시겠습니까?"
          onClose={() => setShowLogoutModal(false)}
          onContinue={handleLogoutClick}
        />
      )}
    </>
  );
}
