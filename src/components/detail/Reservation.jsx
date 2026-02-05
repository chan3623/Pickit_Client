import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// 날짜 → 요일 (1~7, 월~일)
const getDayOfWeek = (dateStr) => {
  const jsDay = new Date(dateStr).getDay();
  return jsDay === 0 ? 7 : jsDay;
};

// 운영 요일 체크
const isOperatingDay = (dateStr, policyDay) => {
  const dayOfWeek = getDayOfWeek(dateStr);
  return policyDay.some(d => d.dayOfWeek === dayOfWeek);
};

// 날짜 기준 policy 찾기
const getPolicyByDate = (dateStr, policyList, policyDay) => {
  const dayOfWeek = getDayOfWeek(dateStr);
  const matchDay = policyDay.find(d => d.dayOfWeek === dayOfWeek);
  if (!matchDay) return null;

  return policyList.find(p => p.id === matchDay.policyId) ?? null;
};

// 서버 슬롯 데이터에서 예약 인원 찾기
const getReservedCount = (date, time, policyId, slots) => {
  const target = slots.find(s =>
    s.policyId === policyId &&
    s.time === time &&
    new Date(s.date).toISOString().slice(0, 10) === date
  );

  return target ? Number(target.reserved) : 0;
};

// 시간 슬롯 생성 (예약 인원 포함)
const generateTimeSlots = (policy, date, slots) => {
  if (!policy || !date) return [];

  const [openH, openM] = policy.openTime.split(":").map(Number);
  const [closeH, closeM] = policy.closeTime.split(":").map(Number);

  const open = openH * 60 + openM;
  const close = closeH * 60 + closeM;

  const slotMinutes = policy.slotMinute;
  const lastStartTime = close - slotMinutes;

  const result = [];
  let current = open;

  while (current <= lastStartTime) {
    const h = Math.floor(current / 60);
    const m = current % 60;

    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const reserved = getReservedCount(
      date,
      time,
      policy.id,
      slots
    );

    result.push({
      time,
      capacity: policy.capacityPerSlot,
      reserved,
    });

    current += slotMinutes;
  }

  return result;
};

export default function Reservation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [popup, setPopup] = useState(null);
  const [policy, setPolicy] = useState([]);
  const [policyDay, setPolicyDay] = useState([]);
  const [slots, setSlots] = useState([]);

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
        const { popup, policy, policyDay, slots } = response.data;

        setPopup(popup);
        setPolicy(policy);
        setPolicyDay(policyDay);

        // 🔥 여기서 슬롯 포맷 정리
        const slotList = slots.map(item => {
          return {
            ...item,
            // "2026-01-24T15:00:00.000Z" → "2026-01-24"
            date: item.date.slice(0, 10),

            // "10:30:00" → "10:30"
            time: item.time.slice(0, 5),

            // "3" → 3
            reserved: Number(item.reserved),
          };
        });

        setSlots(slotList);
      }
    };

    fetchData();
  }, [id]);

  if (!popup || policy.length === 0) return null;

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

  const activePolicy =
    selectedDate && isDateAvailable(selectedDate)
      ? getPolicyByDate(selectedDate, policy, policyDay)
      : null;

  const timeSlots =
    selectedDate && activePolicy
      ? generateTimeSlots(activePolicy, selectedDate, slots)
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

      <div className={styles.monthHeader}>
        <button onClick={goPrevMonth}>‹</button>
        <span>{year}년 {month + 1}월</span>
        <button onClick={goNextMonth}>›</button>
      </div>

      <div className={styles.weekdays}>
        {["일", "월", "화", "수", "목", "금", "토"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.calendar}>
        {days.map((date, idx) => {
          if (!date) return <div key={idx} />;

          const isAvailable = isDateAvailable(date);
          const isSelected = selectedDate === date;
          const jsDay = new Date(date).getDay();

          return (
            <button
              key={date}
              disabled={!isAvailable}
              className={`
                ${styles.day}
                ${isAvailable ? styles.available : styles.unavailable}
                ${isSelected ? styles.selected : ""}
                ${jsDay === 0 ? styles.sunday : ""}
                ${jsDay === 6 ? styles.saturday : ""}
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

      {selectedDate && activePolicy && (
        <>
          <h3 className={styles.subTitle}>시간 선택</h3>
          <div className={styles.timeGrid}>
            {timeSlots.map(slot => {
              const isSelected = selectedTime === slot.time;
              const isFull = slot.reserved >= slot.capacity;

              return (
                <button
                  key={slot.time}
                  disabled={isFull}
                  className={`${styles.time}
                    ${isSelected ? styles.timeSelected : ""}
                    ${isFull ? styles.full : ""}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <div className={styles.timeLabel}>{slot.time}</div>
                  <div className={styles.capacity}>
                    {slot.reserved} / {slot.capacity}명
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <button
        className={styles.reserveBtn}
        disabled={!selectedDate || !selectedTime}
        onClick={() =>
          navigate(`/reservation/confirm`, {
            state: {
              popupId: popup.id,
              date: selectedDate,
              time: selectedTime,
              policyId: activePolicy.id,
            },
          })
        }
      >
        예약하기
      </button>
    </section>
  );
}
