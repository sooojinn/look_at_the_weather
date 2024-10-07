import { TextColor, TextSize, TextWeight } from '@/config/types';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type TextType = {
  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  className?: string;
  href?: string;
  children: ReactNode;
};

export default function Text({
  children,
  size = 'm',
  color = 'lightBlack',
  weight = 'regular',
  href,
  className,
}: TextType) {
  const textSize = {
    xs: 'text-xs',
    s: 'text-s',
    m: 'text-m',
    l: 'text-l',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const textColor = {
    black: 'text-black',
    lightBlack: 'text-lightBlack',
    darkGray: 'text-darkGray',
    gray: 'text-gray',
    lightGray: 'text-lightGray',
    white: 'text-white',
    main: 'text-primary-main',
    disabled: 'text-disabled',
    error: 'text-status-error',
    success: 'text-status-success',
  };

  const textWeight = {
    regular: 'font-regular',
    bold: 'font-bold',
  };

  const classNames = `${textSize[size]} ${textColor[color]} ${textWeight[weight]} ${className} whitespace-nowrap`;

  return (
    <>
      {href ? (
        <NavLink to={href} className={classNames}>
          {children}
        </NavLink>
      ) : (
        <div className={classNames}>{children}</div>
      )}
    </>
  );
}
