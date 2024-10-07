import { useState } from 'react';

export default function ImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // 터치 끝날 때 (좌우 스와이프 판단)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const swipeDistance = touchStart - touchEnd;

    // 50px 이상의 스와이프면 슬라이드 이동
    if (swipeDistance > 50) {
      nextSlide();
    }

    if (swipeDistance < -50) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 슬라이드 이미지 표시 */}
      <div className="w-full h-full flex">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`이미지 ${index}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? '' : 'hidden'
            }`}
          />
        ))}
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 w-full flex gap-1 justify-center">
        {images.map((_, index) => (
          <span
            key={index}
            className={`block w-1.5 h-1.5 bg-white rounded-full cursor-pointer ${
              index === currentIndex ? '' : 'opacity-40'
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
