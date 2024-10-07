import { NavLink } from 'react-router-dom';
import { HangerIcon, HomeIcon, MyPageIcon, WriteIcon } from '../icons/navIcons';

interface NavItem {
  path: string;
  label: string;
  Icon: React.FC<{ fill: string }>;
}

const navList: NavItem[] = [
  { path: '/', label: '홈', Icon: HomeIcon },
  { path: '/post', label: '룩', Icon: HangerIcon },
  { path: '/post-write', label: '글쓰기', Icon: WriteIcon },
  { path: '/mypage', label: '마이페이지', Icon: MyPageIcon },
];

export default function FooterNavi() {
  return (
    <nav className="max-w-md bottom-0 fixed w-full bg-background-white border-t border-line-lightest flex justify-around py-2">
      {navList.map((navItem) => (
        <NavLink
          key={navItem.path}
          to={navItem.path}
          className={({ isActive }) =>
            `flex flex-col items-center w-14 ${isActive ? 'text-primary-main' : 'text-lightGray'}`
          }
        >
          {({ isActive }) => {
            const { Icon } = navItem;
            return (
              <>
                <Icon fill={isActive ? '#1769ff' : '#C7C8C9'} />
                <span className="text-xs mt-1">{navItem.label}</span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
