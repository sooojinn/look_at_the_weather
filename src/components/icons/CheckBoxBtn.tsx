interface CheckBoxIconProps {
  fill: string;
}

interface CheckBoxBtnProps {
  isChecked: boolean;
  isError: boolean;
}

export default function CheckBoxBtn({ isChecked, isError }: CheckBoxBtnProps) {
  const fill = isChecked || isError ? '#1769ff' : '#e0e0e2';
  return <div className="mr-2">{isChecked ? <CheckedBoxIcon fill={fill} /> : <EmptyBoxIcon fill={fill} />}</div>;
}

function CheckedBoxIcon({ fill }: CheckBoxIconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.06667 8.8L9.76667 4.1L8.83333 3.16667L5.06667 6.93333L3.16667 5.03333L2.23333 5.96667L5.06667 8.8ZM1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H10.6667C11.0333 0 11.3472 0.130556 11.6083 0.391667C11.8694 0.652778 12 0.966667 12 1.33333V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM1.33333 10.6667H10.6667V1.33333H1.33333V10.6667Z"
        fill={fill}
      />
    </svg>
  );
}

function EmptyBoxIcon({ fill }: CheckBoxIconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H10.6667C11.0333 0 11.3472 0.130556 11.6083 0.391667C11.8694 0.652778 12 0.966667 12 1.33333V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM1.33333 10.6667H10.6667V1.33333H1.33333V10.6667Z"
        fill={fill}
      />
    </svg>
  );
}
