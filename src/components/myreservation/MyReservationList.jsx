import { ENV } from "@/config/env";
import { showWarning } from "@/lib/swal";
import { cancelUserReservation } from "@/services/popup.api.js";
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

// 상태 텍스트 변환
const getStatusLabel = (status) => {
  switch (status) {
    case "RESERVED":
      return { text: "예약 완료", color: "#00796b", bg: "#e0f7fa" };
    case "COMPLETED":
      return { text: "방문 완료", color: "#424242", bg: "#eeeeee" };
    case "CANCELED_BY_USER":
      return { text: "예약 취소", color: "#c62828", bg: "#fcdada" };
    case "CANCELED_BY_POPUP":
      return { text: "팝업 취소", color: "#c62828", bg: "#fcdada" };
    default:
      return { text: "알 수 없음", color: "#555", bg: "#eee" };
  }
};

export default function MyReservationList({ reservations }) {
  const navigate = useNavigate();

  if (!reservations || reservations.length === 0) {
    return <p className={styles.noReservations}>예약 내역이 없습니다.</p>;
  }

  const handleCancel = async (e, reservationId) => {
    e.stopPropagation();

    const isConfirm = await showWarning("정말 예약을 취소하시겠습니까?");
    if (!isConfirm) return;

    const updateData = {
      id: reservationId,
      status: "CANCELED_BY_USER",
    };

    await cancelUserReservation(updateData);
    window.location.reload();
  };

  const renderReservationCard = (reservation) => {
    const statusInfo = getStatusLabel(reservation.status);

    return (
      <div
        key={reservation.id}
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

        {/* 상태 배지 */}
        <span
          className={styles.statusBadge}
          style={{
            backgroundColor: statusInfo.bg,
            color: statusInfo.color,
          }}
        >
          {statusInfo.text}
        </span>

        {/* 예약 상태일 때만 취소 버튼 노출 */}
        {reservation.status === "RESERVED" && (
          <button
            className={styles.cancelButton}
            onClick={(e) => handleCancel(e, reservation.id)}
          >
            예약 취소
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.reservationListContainer}>
      <h2 className={styles.sectionHeader}>예약 내역</h2>
      {reservations.map((r) => renderReservationCard(r))}
    </div>
  );
}
