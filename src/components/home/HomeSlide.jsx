import { useCallback, useEffect, useMemo, useState } from "react";
import { getRandomPopups } from "@/services/home.api";
import { useNavigate } from "react-router-dom";
import style from "./HomeSlide.module.css";

const BASE_URL = "http://localhost:3000";

export default function HomeSlide() {
  const [popups, setPopups] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTransition, setIsTransition] = useState(false);

  const navigate = useNavigate();

  const ITEM_WIDTH = 460;
  const AUTO_PLAY_TIME = 2000;

  /* ------------------------------
   * 데이터 조회
   * ------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      const response = await getRandomPopups();
      if (response.status === 200) {
        const data = response.data;

        setPopups(data);
        setIndex(data.length); // 무한 슬라이드 기준점
      }
    };

    fetchData();
  }, []);

  /* ------------------------------
   * 슬라이드용 확장 데이터
   * ------------------------------ */
  const extendedPopups = useMemo(() => {
    if (popups.length === 0) return [];
    return [...popups, ...popups, ...popups];
  }, [popups]);

  /* ------------------------------
   * 네비게이션
   * ------------------------------ */
  const handleCardClick = (popupId) => {
    navigate(`/detail/${popupId}`);
  };

  /* ------------------------------
   * 슬라이드 이동
   * ------------------------------ */
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

  /* ------------------------------
   * 무한 슬라이드 보정
   * ------------------------------ */
  useEffect(() => {
    if (!isTransition) return;

    const timer = setTimeout(() => {
      setIsTransition(false);

      if (index >= popups.length * 2) {
        setIndex(index - popups.length);
      } else if (index < popups.length) {
        setIndex(index + popups.length);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [index, isTransition, popups.length]);

  /* ------------------------------
   * 자동 재생
   * ------------------------------ */
  useEffect(() => {
    if (isTransition || popups.length === 0) return;

    const interval = setInterval(nextSlide, AUTO_PLAY_TIME);
    return () => clearInterval(interval);
  }, [isTransition, nextSlide, popups.length]);

  if (popups.length === 0) return null;

  return (
    <div className={style.slideBox}>
      <ul
        className={style.slideInnerBox}
        style={{
          transform: `translateX(-${index * ITEM_WIDTH + ITEM_WIDTH / 2}px)`,
          transition: isTransition ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        {extendedPopups.map((popup, i) => {
          const isCenter = i === index;

          return (
            <li
              key={`${popup.id}-${i}`}
              className={`${style.slideListBox} ${
                isCenter ? style.center : ""
              }`}
              style={{
                transition: isTransition
                  ? "transform 0.5s ease-in-out"
                  : "none",
              }}
            >
              <div
                className={style.card}
                onClick={() => handleCardClick(popup.id)}
              >
                {!isCenter && <div className={style.overlay} />}
                <img
                  src={`${BASE_URL}${popup.imagePath}`}
                  alt={`popup-${popup.id}`}
                  className={style.slideImg}
                />
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
