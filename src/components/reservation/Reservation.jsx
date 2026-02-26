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

// ✅ 현재 KST 날짜 문자열 반환
const getCurrentKSTDate = () => {
  const now = new Date();
  const kstOffset = 9 * 60; // KST는 UTC+9
  const kstTime = new Date(now.getTime() + kstOffset * 60 * 1000);

  const y = kstTime.getUTCFullYear();
  const m = String(kstTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kstTime.getUTCDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

// ✅ 현재 KST 시간 (HH:MM 형식) 반환
const getCurrentKSTTime = () => {
  const now = new Date();
  const kstOffset = 9 * 60;
  const kstTime = new Date(now.getTime() + kstOffset * 60 * 1000);

  const h = String(kstTime.getUTCHours()).padStart(2, "0");
  const m = String(kstTime.getUTCMinutes()).padStart(2, "0");

  return `${h}:${m}`;
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

const normalizeReservations = (reservations) => {
  const map = new Map();

  reservations.forEach((r) => {
    const date = toKSTDateString(r.date);
    const time = r.time.slice(0, 5);
    const key = `${date}_${time}`;

    map.set(key, Number(r.reservedCount));
  });

  return map;
};

// ✅ 시간대가 현재 시간 이후인지 체크
const isTimeSlotAvailable = (date, time, currentDate, currentTime) => {
  if (date > currentDate) return true; // 미래 날짜는 모두 가능
  if (date < currentDate) return false; // 과거 날짜는 모두 불가능

  // 오늘 날짜인 경우, 시간 비교
  return time > currentTime;
};

const generateTimeSlots = (
  dayInfo,
  date,
  reservationMap,
  currentDate,
  currentTime,
) => {
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

    // ✅ 과거 시간대인지 체크
    const isPastTime = !isTimeSlotAvailable(
      date,
      time,
      currentDate,
      currentTime,
    );

    result.push({
      time,
      capacity: dayInfo.capacityPerSlot,
      reserved,
      available: isPastTime ? 0 : dayInfo.capacityPerSlot - reserved, // 과거 시간은 예약 불가
      isPastTime, // UI에서 사용할 수 있도록 플래그 추가
    });

    current += dayInfo.slotMinute;
  }

  return result;
};

export default function Reservation({ data, onSubmitReservation }) {
  const { popup, dayInfos, reservations } = data;

  console.log("data : ", popup);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(1);

  const reservationMap = useMemo(
    () => normalizeReservations(reservations),
    [reservations],
  );

  // ✅ 현재 KST 날짜와 시간 가져오기
  const currentKSTDate = getCurrentKSTDate();
  const currentKSTTime = getCurrentKSTTime();

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

  let dayOfWeek;

  const isDateAvailable = (date) => {
    dayOfWeek = getDayOfWeek(date);

    // ✅ 과거 날짜 체크 추가
    if (date < currentKSTDate) return false;

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
      ? generateTimeSlots(
          activeDayInfo,
          selectedDate,
          reservationMap,
          currentKSTDate,
          currentKSTTime,
        )
      : [];

  const selectedSlot = timeSlots.find((t) => t.time === selectedTime);
  const isCountValid =
    selectedSlot && count > 0 && count <= selectedSlot.available;

  const isFormValid =
    selectedDate && selectedTime && phone.trim() && isCountValid;

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmitReservation({
      popupId: popup.id,
      date: selectedDate,
      dayOfWeek,
      time: selectedTime,
      phone,
      count,
    });
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.monthHeader}>
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <span>
          {year}년 {month + 1}월
        </span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
          ›
        </button>
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
                    {slot.isPastTime
                      ? "지난 시간"
                      : `${slot.reserved} / ${slot.capacity}명`}
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
