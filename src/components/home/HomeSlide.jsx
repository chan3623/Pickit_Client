import { useCallback, useEffect, useMemo, useState } from "react";
import img1 from "../../assets/images/디지몬.webp";
import img6 from "../../assets/images/모프센드.webp";
import img2 from "../../assets/images/빵빵이.webp";
import img3 from "../../assets/images/안전가옥.webp";
import img4 from "../../assets/images/원피스.webp";
import img5 from "../../assets/images/코난.webp";
import style from "./HomeSlide.module.css";

export default function HomeSlide() {
  const images = useMemo(() => [img1, img2, img3, img4, img5, img6], []);
  const ITEM_WIDTH = 460;
  const AUTO_PLAY_TIME = 2000;

  const extendedImages = useMemo(
    () => [...images, ...images, ...images],
    [images],
  );

  const [index, setIndex] = useState(images.length);
  const [isTransition, setIsTransition] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransition) return;
    setIsTransition(true);
    setIndex((prev) => prev + 1);
  }, [isTransition]);

  const prevSlide = useCallback(() => {
    if (isTransition) return;
    setIsTransition(true);
    setIndex((prev) => prev - 1);
  }, [isTransition]);

  useEffect(() => {
    const transitionSpeed = 500;

    if (isTransition) {
      const timer = setTimeout(() => {
        setIsTransition(false);

        // 경계선 도달 시 중앙 세트로 점프 (순간이동)
        if (index >= images.length * 2) {
          setIndex(index - images.length);
        } else if (index < images.length) {
          setIndex(index + images.length);
        }
      }, transitionSpeed);

      return () => clearTimeout(timer);
    }
  }, [index, isTransition, images.length]);

  useEffect(() => {
    // 사용자가 조작 중(isTransition === true)일 때는 타이머를 돌리지 않음
    if (isTransition) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_TIME);

    return () => clearInterval(interval);
  }, [isTransition, nextSlide]);

  return (
    <div className={style.slideBox}>
      <ul
        className={style.slideInnerBox}
        style={{
          transform: `translateX(-${index * ITEM_WIDTH + ITEM_WIDTH / 2}px)`,
          transition: isTransition ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        {extendedImages.map((src, i) => {
          const isCenter = i === index;

          return (
            <li
              key={i}
              className={`${style.slideListBox} ${isCenter ? style.center : ""}`}
              style={{
                transition: isTransition
                  ? "transform 0.5s ease-in-out"
                  : "none",
              }}
            >
              <div className={style.card}>
                {!isCenter && <div className={style.overlay} />}
                <img src={src} alt={`slide-${i}`} className={style.slideImg} />
              </div>
            </li>
          );
        })}
      </ul>

      <button className={style.leftBtn} onClick={prevSlide}>
        이전
      </button>
      <button className={style.rightBtn} onClick={nextSlide}>
        다음
      </button>
    </div>
  );
}
