import { ENV } from "@/config/env";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./HomeList.module.css";

export default function HomeList({
  data,
  status,
  setStatus,
  keyword,
  setKeyword,
  loadMore,
  hasNext,
}) {
  const navigate = useNavigate();
  const observer = useRef(null);

  const [localKeyword, setLocalKeyword] = useState(keyword);
  const debounceTimer = useRef(null);

  const loadingRef = useRef(false);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setKeyword(localKeyword);
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [localKeyword, setKeyword]);

  const handleCardClick = (popupId) => {
    navigate(`/detail/${popupId}`);
  };

  const lastElementRef = useCallback(
    (node) => {
      if (!hasNext) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (loadingRef.current) return;

          loadingRef.current = true;

          loadMore();

          setTimeout(() => {
            loadingRef.current = false;
          }, 500);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadMore, hasNext],
  );

  const popupList = useMemo(() => {
    const uniqueMap = new Map();

    data.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    const uniqueData = Array.from(uniqueMap.values());

    return uniqueData.map((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);

      const kstStartDate = new Date(startDate.getTime() + 9 * 60 * 60 * 1000);
      const kstEndDate = new Date(endDate.getTime() + 9 * 60 * 60 * 1000);

      const now = new Date();

      let tag = "예약중";

      if (startDate > now) tag = "오픈예정";
      if (endDate < now) tag = "종료";

      return {
        ...item,
        startDate: kstStartDate.toISOString().split("T")[0],
        endDate: kstEndDate.toISOString().split("T")[0],
        src: `${ENV.API_BASE_URL}${item.imagePath}`,
        tag,
      };
    });
  }, [data]);

  return (
    <div className={style.listBox}>
      <div className={style.titleInnerBox}>
        <p>팝업스토어 둘러보기</p>
      </div>

      <div className={style.filterBox}>
        <div className={style.statusTabs}>
          <button
            className={status === "ALL" ? style.activeTab : style.tab}
            onClick={() => setStatus("ALL")}
          >
            전체
          </button>

          <button
            className={status === "ONGOING" ? style.activeTab : style.tab}
            onClick={() => setStatus("ONGOING")}
          >
            진행 중
          </button>

          <button
            className={status === "UPCOMING" ? style.activeTab : style.tab}
            onClick={() => setStatus("UPCOMING")}
          >
            진행 예정
          </button>

          <button
            className={status === "CLOSED" ? style.activeTab : style.tab}
            onClick={() => setStatus("CLOSED")}
          >
            종료
          </button>
        </div>

        <input
          className={style.search}
          value={localKeyword}
          onChange={(e) => setLocalKeyword(e.target.value)}
          placeholder="팝업스토어 검색"
        />
      </div>

      <ul className={style.listInnerBox}>
        {popupList.map((item, index) => {
          if (popupList.length === index + 1) {
            return (
              <li
                ref={lastElementRef}
                key={item.id}
                className={style.listItem}
                onClick={() => handleCardClick(item.id)}
              >
                <div className={style.cardImgBox}>
                  <img src={item.src} alt={item.title} />
                  <div className={style.tag}>{item.tag}</div>
                </div>

                <div className={style.cardTextBox}>
                  <h3 className={style.title}>{item.title}</h3>

                  <span className={style.date}>
                    {item.startDate} - {item.endDate}
                  </span>
                </div>
              </li>
            );
          }

          return (
            <li
              key={item.id}
              className={style.listItem}
              onClick={() => handleCardClick(item.id)}
            >
              <div className={style.cardImgBox}>
                <img src={item.src} alt={item.title} />
                <div className={style.tag}>{item.tag}</div>
              </div>

              <div className={style.cardTextBox}>
                <h3 className={style.title}>{item.title}</h3>

                <span className={style.date}>
                  {item.startDate} - {item.endDate}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
