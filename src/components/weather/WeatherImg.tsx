interface WeatherImgProps {
  weatherType: string;
  width: number;
  height: number;
}

export default function WeatherImg({ weatherType, width, height }: WeatherImgProps) {
  const weatherImgSrc = `/weatherImages/${weatherType}.svg`;

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className="flex justify-end">
      <img src={weatherImgSrc} className="h-[80%] object-contain" />
    </div>
  );
}
