interface IconProps {
  fill: string;
}

export const ArrowIcon: React.FC<IconProps> = ({ fill }) => {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path d="M1.62359 12L0.558594 10.935L5.49359 6L0.558594 1.065L1.62359 0L7.62359 6L1.62359 12Z" fill="#171719" />
    </svg>
  );
};
