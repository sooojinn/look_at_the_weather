type HeightTYpe = {
  height: number;
};

export function Line({ height }: HeightTYpe) {
  return <div style={{ height: `${height}px` }} className="bg-line-lightest" />;
}
