import Text from '../atom/Text';
import TextWithArrow from '../atom/TextWithArrow';

type MenuItem = {
  menu: string;
  href: string;
};

type PropsType = {
  title: string;
  menuList: MenuItem[];
};

export default function LinkMenu({ title, menuList }: PropsType) {
  return (
    <div className="bg-background-white px-5">
      <div className="py-[18px]">
        <Text color="gray" size="m">
          {title}
        </Text>
      </div>
      <div>
        {menuList.map((data, index) => (
          <TextWithArrow key={index} href={data.href}>
            {data.menu}
          </TextWithArrow>
        ))}
      </div>
    </div>
  );
}
