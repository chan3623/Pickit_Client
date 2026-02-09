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
            src={`http://localhost:3000${popup.imagePath}`}
            alt={popup.title}
          />
        </div>

        <div className={style.infoInnerBox}>
          <ul className={style.textInnerBox}>
            <li className={style.listBox}>
              <h1>{popup.title}</h1>
            </li>

            <li className={style.listBox}>
              <div className={style.rangeBox}>
                {formatDate(popup.startDate)} - {formatDate(popup.endDate)}
              </div>
            </li>

            <li className={style.listBox}>
              <div>{popup.address}</div>
            </li>

            <li className={style.listBox}>
              <ul>
                {operatingTimeList.map((item) => (
                  <li key={item.id}>
                    {item.day}요일 : {item.open} - {item.close}
                    <span>
                      {" "}
                      ( {item.slotMinute}분 / 최대 {item.capacity}명 )
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className={style.carAndPriceInnerBox}>
            <div className={style.carAndPriceBox}>
              <p>주차 및 입장 정보</p>
            </div>

            <ul className={style.infoListBox}>
              {infoData.map((item) => (
                <li key={item.id} className={style.infoItem}>
                  <img
                    src={`/icons/${item.id}.png`}
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
