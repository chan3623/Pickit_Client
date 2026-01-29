import style from "./HomeList.module.css";

import img11 from "../../assets/images/PUBG.webp";
import img7 from "../../assets/images/가정교사히트맨.webp";
import img8 from "../../assets/images/나만의금쪽이.webp";
import img1 from "../../assets/images/디지몬.webp";
import img6 from "../../assets/images/모프센드.webp";
import img2 from "../../assets/images/빵빵이.webp";
import img9 from "../../assets/images/아트북페어.webp";
import img3 from "../../assets/images/안전가옥.webp";
import img4 from "../../assets/images/원피스.webp";
import img10 from "../../assets/images/전지적독자시점.webp";
import img5 from "../../assets/images/코난.webp";

const images = [
  {
    id: 1,
    src: img1,
    title: "디지몬 어드벤쳐 콜라보카페",
    startDay: "2026-01-22",
    endDay: "2026-03-25",
  },
  {
    id: 2,
    src: img2,
    title: "빵빵이의 타로집 in 더현대 대구",
    startDay: "2026-01-23",
    endDay: "2026-02-05",
  },
  {
    id: 3,
    src: img3,
    title: "안전가옥 장르연회:더 갈라 팝업스토어",
    startDay: "2026-01-26",
    endDay: "2026-02-01",
  },
  {
    id: 4,
    src: img4,
    title: "JUMP SHOP in SEOUL 제 2탄",
    startDay: "2026-01-23",
    endDay: "2026-02-05",
  },
  {
    id: 5,
    src: img5,
    title: "《100만 달러의 수수께끼 저택 탈출》 명탐정 코난 추리게임 팝업",
    startDay: "2026-01-09",
    endDay: "2026-02-08",
  },
  {
    id: 6,
    src: img6,
    title: "모프샌드 팝업스토어",
    startDay: "2026-01-17",
    endDay: "2026-03-02",
  },
  {
    id: 7,
    src: img7,
    title: "가정교사히트맨리본 팝업스토어",
    startDay: "2026-01-16",
    endDay: "2026-02-04",
  },
  {
    id: 8,
    src: img8,
    title: "금쪽같은 내새끼 X 마플 커스텀스토어",
    startDay: "2026-01-19",
    endDay: "2026-01-31",
  },
  {
    id: 9,
    src: img9,
    title: "아트북페어 림",
    startDay: "2026-02-07",
    endDay: "2026-02-08",
  },
  {
    id: 10,
    src: img10,
    title: "2026 전지적 독자 시점 [spot] POP-UP",
    startDay: "2026-01-30",
    endDay: "2026-02-08",
  },
  {
    id: 11,
    src: img11,
    title: "PUBG 성수 WINTER SCHOOL",
    startDay: "2026-01-17",
    endDay: "2026-02-27",
  },
];

export default function HomeList() {
  return (
    <div className={style.listBox}>
      <div className={style.titleInnerBox}>
        <p>팝업스토어 둘러보기</p>
      </div>

      <ul className={style.listInnerBox}>
        {images.map((item) => (
          <li key={item.id} className={style.listItem}>
            <div className={style.cardImgBox}>
              <img src={item.src} alt={item.title} />
              <div className={style.tag}>예약중</div>
            </div>
            <div className={style.cardTextBox}>
              <h3 className={style.title}>{item.title}</h3>
              {/* 🌟 location 대신 날짜 정보 표시 */}
              <span className={style.date}>
                {item.startDay} - {item.endDay}
              </span>

              {/* <p className={style.desc}>지금 바로 예약하고 방문해보세요.</p> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
