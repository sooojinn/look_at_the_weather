interface CloseBtnProps {
  width?: number;
  fill?: string;
  onClick: () => void;
}

export default function CloseBtn({ width = 24, fill = '#171719', onClick }: CloseBtnProps) {
  return (
    <svg
      className="cursor-pointer"
      onClick={onClick}
      width={width}
      height={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
        fill={fill}
      />
    </svg>
  );
}
