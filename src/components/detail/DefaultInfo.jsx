import style from "./DefaultInfo.module.css";
import { useParams } from "react-router-dom";
import { getPopupOperation } from "@/services/detail.api";
import { useEffect, useState } from "react";

const DAY_MAP = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};

export default function DefaultInfo() {
  const { id } = useParams();

  const [popup, setPopup] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [policyDay, setPolicyDay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPopupOperation(id);
      if (response.status === 200) {
        const { popup, policy, policyDay } = response.data;
        setPopup(popup);
        setPolicy(policy);
        setPolicyDay(policyDay);
      }
    };
    fetchData();
  }, [id]);

  if (!popup || !policy) return null;

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  const formatTime = (time) => time?.slice(0, 5);

const operatingTimeList = policyDay
  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  .map((day) => {
    const matchedPolicy = policy.find(
      (p) => p.id === day.policyId
    );

    if (!matchedPolicy) return null;

    return {
      day: DAY_MAP[day.dayOfWeek],
      open: formatTime(matchedPolicy.openTime),
      close: formatTime(matchedPolicy.closeTime),
    };
  })
  .filter(Boolean);

  const infoData = [
    {
      id: popup.park ? "park" : "no-park",
      text: popup.park ? "주차가능" : "주차불가",
    },
    {
      id: popup.is_free ? "free" : "paid",
      text: popup.is_free ? "입장료 무료" : "입장료 유료",
    },
  ];

  return (
    <div className={style.defaultInfoBox}>
      <div className={style.imageInfoInnerBox}>
        <div className={style.imageBox}>
          <img className={style.image} src={`http://localhost:3000${popup.imagePath}`} />
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
              <div>
                {popup.address}
              </div>
            </li>

            <li className={style.listBox}>
              <ul>
                {operatingTimeList.map((item) => (
                  <li key={item.day}>
                    {item.day} : {item.open} - {item.close}
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className={style.carAndPriceInnerBox}>
            <div className={style.carAndPriceBox}>
              <p>주차 및 입장료</p>
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
