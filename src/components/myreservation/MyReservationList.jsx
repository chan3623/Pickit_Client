import { ENV } from "@/config/env";
import { formatKoreanDateTime } from "@/utils/date";
import { useNavigate } from "react-router-dom";
import styles from "./MyReservationList.module.css";

// 전화번호 포맷팅
const formatPhoneNumber = (tel) => {
  if (!tel) return "";
  const onlyNumbers = tel.replace(/\D/g, "");
  if (onlyNumbers.length === 11)
    return onlyNumbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (onlyNumbers.length === 10)
    return onlyNumbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  return tel;
};

// 현재 예약인지 이전 예약인지 판단
const isPastReservation = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute, second] = timeStr.split(":").map(Number);

  const reservationDateTime = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
  );

  return new Date() > reservationDateTime;
};

// D-day 계산
const getDDay = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute, second] = timeStr.split(":").map(Number);

  const reservationDate = new Date(year, month - 1, day, hour, minute, second);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const reservationStart = new Date(
    reservationDate.getFullYear(),
    reservationDate.getMonth(),
    reservationDate.getDate(),
  );

  const diffTime = reservationStart.getTime() - todayStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;
  if (diffDays === 0) return { text: "D-Day", isWarning: true };
  if (diffDays <= 3) return { text: `D-${diffDays}`, isWarning: true };

  return { text: `D-${diffDays}`, isWarning: false };
};

export default function MyReservationList({ reservations }) {
  const navigate = useNavigate();

  if (!reservations || reservations.length === 0) {
    return <p className={styles.noReservations}>예약 내역이 없습니다.</p>;
  }

  const currentReservations = reservations.filter(
    (r) => !isPastReservation(r.reservationDate, r.reservationTime),
  );
  const pastReservations = reservations.filter((r) =>
    isPastReservation(r.reservationDate, r.reservationTime),
  );

  const renderReservationCard = (reservation, isCurrent) => {
    const dDay = isCurrent
      ? getDDay(reservation.reservationDate, reservation.reservationTime)
      : null;

    return (
      <div
        key={
          reservation.popupId +
          reservation.reservationDate +
          reservation.reservationTime
        }
        className={styles.reservationCard}
        onClick={() => navigate(`/detail/${reservation.popupId}`)}
      >
        <div className={styles.cardImageWrapper}>
          <img
            src={`${ENV.API_BASE_URL}${reservation.imagePath}`}
            alt={reservation.title}
            className={styles.cardImage}
          />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.popupName}>{reservation.title}</h3>

          <p className={styles.reservationDetail}>
            <strong>날짜 및 시간:</strong>{" "}
            {formatKoreanDateTime(
              reservation.reservationDate,
              reservation.reservationTime,
            )}
          </p>

          <p className={styles.reservationDetail}>
            <strong>인원:</strong> {reservation.quantity}명
          </p>

          <p className={styles.reservationDetail}>
            <strong>연락처:</strong>{" "}
            {formatPhoneNumber(reservation.reserverPhone)}
          </p>

          <p className={styles.reservationDetail}>
            <strong>장소:</strong> {reservation.address}
          </p>
        </div>

        {dDay && (
          <span
            className={styles.dDayBadge}
            style={{
              backgroundColor: dDay.isWarning ? "#fcdada" : "#e0f7fa",
              color: dDay.isWarning ? "#c62828" : "#00796b",
            }}
          >
            {dDay.text}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={styles.reservationListContainer}>
      {currentReservations.length > 0 && (
        <>
          <h2 className={styles.sectionHeader}>예약 내역</h2>
          {currentReservations.map((r) => renderReservationCard(r, true))}
        </>
      )}

      {pastReservations.length > 0 && (
        <>
          <h2 className={styles.sectionHeader}>이전 내역</h2>
          {pastReservations.map((r) => renderReservationCard(r, false))}
        </>
      )}
    </div>
  );
}
