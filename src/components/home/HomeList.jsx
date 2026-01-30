import { getPopups } from "@/services/home.api";
import style from "./HomeList.module.css";

import img11 from "@/assets/images/PUBG.webp";
import img7 from "@/assets/images/가정교사히트맨.webp";
import img8 from "@/assets/images/나만의금쪽이.webp";
import img1 from "@/assets/images/디지몬.webp";
import img6 from "@/assets/images/모프센드.webp";
import img2 from "@/assets/images/빵빵이.webp";
import img9 from "@/assets/images/아트북페어.webp";
import img3 from "@/assets/images/안전가옥.webp";
import img4 from "@/assets/images/원피스.webp";
import img10 from "@/assets/images/전지적독자시점.webp";
import img5 from "@/assets/images/코난.webp";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

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

        const selectPopupList = data.map((item, index) => {
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
            src: images[index],
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
