import { useMemo, useState } from "react";
import styles from "./Reservation.module.css";

/* =====================
   유틸 함수
===================== */

// ISO 날짜에 +9시간 적용해서 YYYY-MM-DD 반환
const toKSTDateString = (isoDateStr) => {
  const date = new Date(isoDateStr);
  date.setHours(date.getHours() + 9);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const isWithinPopupPeriod = (dateStr, popup) => {
  const date = new Date(dateStr);
  const start = new Date(popup.startDate);
  const end = new Date(popup.endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

const getDayOfWeek = (dateStr) => {
  const jsDay = new Date(dateStr).getDay();
  return jsDay === 0 ? 7 : jsDay;
};

// ✅ 여기서 timezone 보정
const normalizeReservations = (reservations) => {
  const map = new Map();

  reservations.forEach((r) => {
    const date = toKSTDateString(r.date); // ← 핵심 수정
    const time = r.time.slice(0, 5);
    const key = `${date}_${time}`;

    map.set(key, Number(r.reservedCount));
  });

  return map;
};

const generateTimeSlots = (dayInfo, date, reservationMap) => {
  if (!dayInfo) return [];

  const [openH, openM] = dayInfo.openTime.split(":").map(Number);
  const [closeH, closeM] = dayInfo.closeTime.split(":").map(Number);

  const open = openH * 60 + openM;
  const close = closeH * 60 + closeM;
  const lastStart = close - dayInfo.slotMinute;

  const result = [];
  let current = open;

  while (current <= lastStart) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const key = `${date}_${time}`;
    const reserved = reservationMap.get(key) ?? 0;

    result.push({
      time,
      capacity: dayInfo.capacityPerSlot,
      reserved,
      available: dayInfo.capacityPerSlot - reserved,
    });

    current += dayInfo.slotMinute;
  }

  return result;
};

export default function Reservation({ data, onSubmitReservation }) {
  const { popup, dayInfos, reservations } = data;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(1);

  const reservationMap = useMemo(
    () => normalizeReservations(reservations),
    [reservations],
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    );
  }

  const isDateAvailable = (date) => {
    const dayOfWeek = getDayOfWeek(date);
    return (
      isWithinPopupPeriod(date, popup) &&
      dayInfos.some((d) => d.dayOfWeek === dayOfWeek)
    );
  };

  const activeDayInfo =
    selectedDate &&
    dayInfos.find((d) => d.dayOfWeek === getDayOfWeek(selectedDate));

  const timeSlots =
    selectedDate && activeDayInfo
      ? generateTimeSlots(activeDayInfo, selectedDate, reservationMap)
      : [];

  const selectedSlot = timeSlots.find((t) => t.time === selectedTime);
  const isCountValid =
    selectedSlot && count > 0 && count <= selectedSlot.available;

  const isFormValid =
    selectedDate &&
    selectedTime &&
    phone.trim() &&
    isCountValid;

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmitReservation({
      popupId: popup.id,
      date: selectedDate,
      time: selectedTime,
      phone,
      count,
    });
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.monthHeader}>
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
        <span>{year}년 {month + 1}월</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className={styles.weekdays}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className={styles.calendar}>
        {days.map((date, idx) => {
          if (!date) return <div key={idx} />;
          const isAvailable = isDateAvailable(date);
          const isSelected = selectedDate === date;

          return (
            <button
              key={date}
              disabled={!isAvailable}
              className={`${styles.day} ${isAvailable ? styles.available : styles.unavailable} ${isSelected ? styles.selected : ""}`}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
                setPhone("");
                setCount(1);
              }}
            >
              {Number(date.split("-")[2])}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <>
          <h3 className={styles.subTitle}>시간 선택</h3>
          <div className={styles.timeGrid}>
            {timeSlots.map((slot) => {
              const isFull = slot.available <= 0;
              return (
                <button
                  key={slot.time}
                  disabled={isFull}
                  className={`${styles.time} ${selectedTime === slot.time ? styles.timeSelected : ""} ${isFull ? styles.full : ""}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <div>{slot.time}</div>
                  <div className={styles.capacity}>
                    {slot.reserved} / {slot.capacity}명
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedTime && selectedSlot && (
        <div className={styles.form}>
          <h3 className={styles.subTitle}>예약자 정보</h3>

          <div className={styles.field}>
            <span className={styles.label}>휴대폰 번호</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>예약 인원</span>
            <input
              type="number"
              min="1"
              max={selectedSlot.available}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
            <p className={styles.helper}>
              예약 가능 인원 {selectedSlot.available}명
            </p>
          </div>
        </div>
      )}

      <button
        className={styles.reserveBtn}
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        예약하기
      </button>
    </section>
  );
}
