import Header from '@components/common/Header';
import Text from '@components/common/atom/Text';
import Button from '@components/common/molecules/Button';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FindEmailResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state;

  return (
    <div className="flex flex-col h-screen">
      <Header onClose={() => navigate('/')}>이메일 찾기</Header>
      <div className="flex flex-col justify-between h-screen flex-grow p-5 pb-10">
        <div>
          <div className="px-20 mb-4">
            <Text size="l" color="black" weight="bold">
              {name} 님의 가입된 이메일 정보는 아래와 같습니다.
            </Text>
          </div>
          <div className="w-full h-14 py-3 flex justify-center items-center bg-background-light rounded-[10px]">
            <Text size="l" color="black" weight="bold">
              {email}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button type="white" onClick={() => navigate('/find-password')}>
            비밀번호 찾기
          </Button>
          <Button onClick={() => navigate('/')}>로그인하기</Button>
        </div>
      </div>
    </div>
  );
}
