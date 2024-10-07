interface CheckIconProps {
  fill: string;
  width: number;
}

export default function CheckIcon({ fill, width }: CheckIconProps) {
  return (
    <svg width={width} height={width * 0.75} viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.36641 9.00007L0.566406 5.20007L1.51641 4.25007L4.36641 7.10007L10.4831 0.983398L11.4331 1.9334L4.36641 9.00007Z"
        fill={fill}
      />
    </svg>
  );
}
