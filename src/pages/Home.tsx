import { useEffect, useState } from 'react';
import FooterNavi from '@/components/common/FooterNavi';
import Header from '@/components/common/Header';
import Logo from '@components/common/atom/Logo';
import LoginModal from '@/components/login/LoginModal';
import HomeWeatherInfo from '@components/weather/HomeWeatherInfo';
import TodayBestWearList from '@/components/post/TodayBestWearList';
import { isLogin } from '@/api/instance';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLoginCheck = async () => {
    setIsLoggedIn(isLogin());
  };

  useEffect(() => {
    handleLoginCheck();
  }, [isLogin()]);

  return (
    <div className="max-w-md m-auto min-h-screen pb-[61px] flex flex-col items-center justify-start relative">
      {isLoggedIn || <LoginModal />}
      <Header>
        <Logo />
      </Header>
      <HomeWeatherInfo />
      {isLoggedIn && <TodayBestWearList />}
      <FooterNavi />
    </div>
  );
}
