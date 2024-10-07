interface HrLineProps {
  height: number;
}

export default function HrLine({ height }: HrLineProps) {
  return (
    <>
      {height === 1 ? (
        <hr className={`-mx-5 bg-gray-200 border-line-lightest`} />
      ) : (
        <hr className={`-mx-5 bg-gray-200 border-[4px] border-line-lightest`} />
      )}
    </>
  );
}
