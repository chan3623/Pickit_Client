import { getPopups } from "@/services/home.api";
import style from "./HomeList.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeList() {
  const [popupList, setPopupList] = useState([]);

  const navigate = useNavigate();

  const handleCardClick = (popupId) => {
    navigate(`/detail/${popupId}`);
  };

  useEffect(() => {
    const selectPopups = async () => {
      const response = await getPopups();
      if (response.status === 200 && response.statusText === "OK") {
        const { data } = response;

        const selectPopupList = data.map((item) => {
          const startDate = new Date(item.startDate);
          const endDate = new Date(item.endDate);

          const kstStartDate = new Date(
            startDate.getTime() + 9 * 60 * 60 * 1000,
          );
          const kstEndDate = new Date(endDate.getTime() + 9 * 60 * 60 * 1000);
          return {
            ...item,
            startDate: kstStartDate.toISOString().split("T")[0],
            endDate: kstEndDate.toISOString().split("T")[0],
            src: `http://localhost:3000${item.imagePath}`,
          };
        });

        setPopupList(selectPopupList);
      }
    };

    selectPopups();
  }, []);

  return (
    <div className={style.listBox}>
      <div className={style.titleInnerBox}>
        <p>팝업스토어 둘러보기</p>
      </div>

      <ul className={style.listInnerBox}>
        {popupList.map((item) => (
          <li
            key={item.id}
            className={style.listItem}
            onClick={() => handleCardClick(item.id)}
          >
            <div className={style.cardImgBox}>
              <img src={item.src} alt={item.title} />
              <div className={style.tag}>예약중</div>
            </div>
            <div className={style.cardTextBox}>
              <h3 className={style.title}>{item.title}</h3>
              {/* 🌟 location 대신 날짜 정보 표시 */}
              <span className={style.date}>
                {item.startDate} - {item.endDate}
              </span>

              {/* <p className={style.desc}>지금 바로 예약하고 방문해보세요.</p> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
