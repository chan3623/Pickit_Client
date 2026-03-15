import { ENV } from "@/config/env.js";
import style from "./DefaultInfo.module.css";

const DAY_MAP = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};

export default function DefaultInfo({ data }) {
  if (!data || !data.popup || !Array.isArray(data.dayOfInfo)) return null;

  const { popup, dayOfInfo } = data;

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => time?.slice(0, 5);

  const operatingTimeList = [...dayOfInfo]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .map((info) => ({
      id: info.id,
      day: DAY_MAP[info.dayOfWeek],
      open: formatTime(info.openTime),
      close: formatTime(info.closeTime),
      slotMinute: info.slotMinute,
      capacity: info.capacityPerSlot,
    }));

  const infoData = [
    {
      id: popup.park ? "park" : "no-park",
      text: popup.park ? "주차 가능" : "주차 불가",
    },
    {
      id: popup.isFree ? "free" : "paid",
      text: popup.isFree ? "입장료 무료" : "입장료 유료",
    },
  ];

  return (
    <div className={style.defaultInfoBox}>
      <div className={style.imageInfoInnerBox}>
        <div className={style.imageBox}>
          <img
            className={style.image}
            src={`${ENV.API_BASE_URL}${popup.imagePath}`}
            alt={popup.title}
          />
        </div>

        <div className={style.infoInnerBox}>
          <div className={style.infoTop}>
            <h1 className={style.title}>{popup.title}</h1>

            <div className={style.infoTable}>
              <div className={style.row}>
                <div className={style.label}>기간</div>
                <div className={style.value}>
                  {formatDate(popup.startDate)} - {formatDate(popup.endDate)}
                </div>
              </div>

              <div className={style.row}>
                <div className={style.label}>주소</div>
                <div className={style.value}>{popup.address}</div>
              </div>

              <div className={style.row}>
                <div className={style.label}>운영시간</div>

                <div className={style.dayGridBox}>
                  <div className={style.dayGrid}>
                    {operatingTimeList.map((item) => (
                      <div key={item.id} className={style.dayItem}>
                        <span className={style.day}>{item.day}</span>
                        <span className={style.time}>
                          {item.open} - {item.close}
                        </span>
                        <span className={style.meta}>
                          {item.slotMinute}분 / {item.capacity}명
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={style.carAndPriceInnerBox}>
            <p className={style.sectionTitle}>주차 및 입장 정보</p>

            <ul className={style.infoListBox}>
              {infoData.map((item) => (
                <li key={item.id} className={style.infoItem}>
                  <img
                    src={`icons/${item.id}.png`}
                    alt={item.text}
                    className={style.icon}
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
