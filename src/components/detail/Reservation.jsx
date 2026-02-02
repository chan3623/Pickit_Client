import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPopupOperation } from "@/services/detail.api";
import styles from "./Reservation.module.css";

/* =====================
   유틸 함수
===================== */

// 팝업 기간 체크
const isWithinPopupPeriod = (dateStr, popup) => {
  const date = new Date(dateStr);
  const start = new Date(popup.startDate);
  const end = new Date(popup.endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

// 운영 요일 체크
const isOperatingDay = (dateStr, policyDay) => {
  const jsDay = new Date(dateStr).getDay(); // 0~6
  const dayOfWeek = jsDay === 0 ? 7 : jsDay; // 1~7 (월~일)

  return policyDay.some(d => d.dayOfWeek === dayOfWeek);
};

// 시간 슬롯 생성 (안 맞으면 버림)
const generateTimeSlots = (policy) => {
  if (!policy) return [];

  const [openH] = policy.openTime.split(":").map(Number);
  const [closeH] = policy.closeTime.split(":").map(Number);

  const slots = [];
  let current = openH;

  while (current + policy.slotHours <= closeH) {
    slots.push(`${String(current).padStart(2, "0")}:00`);
    current += policy.slotHours;
  }

  return slots;
};

export default function Reservation() {
  const { id } = useParams();

  const [popup, setPopup] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [policyDay, setPolicyDay] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  /* =====================
     데이터 로딩
  ===================== */
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

  /* =====================
     달력 계산
  ===================== */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push(date);
  }

  const isDateAvailable = (date) => {
    return (
      isWithinPopupPeriod(date, popup) &&
      isOperatingDay(date, policyDay)
    );
  };

  const timeSlots =
    selectedDate && isDateAvailable(selectedDate)
      ? generateTimeSlots(policy)
      : [];

  /* =====================
     월 이동
  ===================== */
  const goPrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  /* =====================
     렌더링
  ===================== */
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>예약하기</h2>

      {/* 월 이동 */}
      <div className={styles.monthHeader}>
        <button onClick={goPrevMonth}>‹</button>
        <span>{year}년 {month + 1}월</span>
        <button onClick={goNextMonth}>›</button>
      </div>

      {/* 요일 */}
      <div className={styles.weekdays}>
        {["일", "월", "화", "수", "목", "금", "토"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 달력 */}
      <div className={styles.calendar}>
        {days.map((date, idx) => {
          if (!date) return <div key={idx} />;

          const isAvailable = isDateAvailable(date);
          const isSelected = selectedDate === date;

          const jsDay = new Date(date).getDay();
          const isSunday = jsDay === 0;
          const isSaturday = jsDay === 6;

          return (
            <button
              key={date}
              disabled={!isAvailable}
              className={`
                ${styles.day}
                ${isAvailable ? styles.available : styles.unavailable}
                ${isSelected ? styles.selected : ""}
                ${isSunday ? styles.sunday : ""}
                ${isSaturday ? styles.saturday : ""}
              `}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            >
              {Number(date.split("-")[2])}
            </button>
          );
        })}
      </div>

      {/* 시간 선택 */}
      {selectedDate && (
        <>
          <h3 className={styles.subTitle}>시간 선택</h3>
          <div className={styles.timeGrid}>
            {timeSlots.map(time => (
              <button
                key={time}
                className={`${styles.time}
                  ${selectedTime === time ? styles.timeSelected : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        className={styles.reserveBtn}
        disabled={!selectedDate || !selectedTime}
      >
        예약하기
      </button>
    </section>
  );
}
