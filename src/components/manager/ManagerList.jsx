import { ENV } from "@/config/env";
import { showError, showSuccess, showWarning } from "@/lib/swal";
import { useNavigate } from "react-router-dom";
import { cancelPopup, earlyClosePopup } from "../../services/popup.api";
import styles from "./ManagerList.module.css";

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const isActivePopup = (startDate, endDate) => {
  const today = new Date();
  return new Date(startDate) <= today && today <= new Date(endDate);
};

export default function ManagerList({ popups, onStatusChange }) {
  const navigate = useNavigate();

  const handleEdit = (popupId) => {
    navigate("/edit", { state: { popupId } });
  };

  const handleReservationManage = (popupId) => {
    navigate("/reservationManage", { state: { popupId } });
  };

  const handleEarlyClose = async (popupId) => {
    const ok = await showWarning(
      "",
      "조기 종료 시 신규 예약이 불가능합니다.\n조기 종료하시겠습니까?",
    );
    if (!ok) return;

    const updateData = {
      id: popupId,
      status: "EARLY_CLOSED",
    };

    try {
      const response = await earlyClosePopup(updateData);

      if (response.success) {
        onStatusChange(popupId, "EARLY_CLOSED");
        showSuccess("팝업스토어가 조기 종료되었습니다.");
      }
    } catch (e) {
      showError("문제가 발생되었습니다.");
      console.log(e);
    }
  };

  const handleCancel = async (popupId) => {
    const nowDate = new Date();

    const year = nowDate.getFullYear();
    const month = String(nowDate.getMonth() + 1).padStart(2, "0");
    const date = String(nowDate.getDate()).padStart(2, "0");
    const hour = String(nowDate.getHours()).padStart(2, "0");
    const minute = String(nowDate.getMinutes()).padStart(2, "0");

    const ok = await showWarning(
      "",
      "운영 취소 시 모든 예약이 강제 취소됩니다.\n정말 운영을 취소하시겠습니까?",
    );
    if (!ok) return;

    const updateData = {
      id: popupId,
      status: "CANCELED",
      date: `${year}-${month}-${date}`,
      time: `${hour}:${minute}:00`,
    };

    try {
      const response = await cancelPopup(updateData);
      if (response.success) {
        onStatusChange(popupId, "CANCELED");
        showSuccess("팝업스토어 운영이 취소되었습니다.");
      }
    } catch (e) {
      showError("문제가 발생되었습니다.");
      console.log(e);
    }
  };

  if (!popups || popups.length === 0) {
    return (
      <div className={styles.empty}>
        <strong>아직 등록된 팝업스토어가 없습니다</strong>
        <p>상단의 등록 버튼을 눌러 첫 팝업스토어를 만들어보세요</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {popups.map((popup) => {
        const active = isActivePopup(popup.startDate, popup.endDate);
        const isDisabled = popup.status !== "ACTIVE";

        return (
          <div key={popup.id} className={styles.row}>
            <div className={styles.thumb}>
              <img
                src={`${ENV.API_BASE_URL}${popup.imagePath}`}
                alt={popup.title}
              />
            </div>

            <div className={styles.meta}>
              <div className={styles.titleLine}>
                <h3>{popup.title}</h3>
                <span className={active ? styles.active : styles.inactive}>
                  {popup.status === "ACTIVE"
                    ? "운영중"
                    : popup.status === "EARLY_CLOSED"
                      ? "조기 종료"
                      : popup.status === "CANCELED"
                        ? "운영 취소"
                        : "종료"}
                </span>
              </div>

              <div className={styles.period}>
                {formatDate(popup.startDate)} ~ {formatDate(popup.endDate)}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.manage}
                onClick={() => handleReservationManage(popup.id)}
              >
                예약관리
              </button>

              <button
                className={styles.edit}
                onClick={() => handleEdit(popup.id)}
              >
                수정
              </button>

              <button
                className={styles.earlyClose}
                disabled={isDisabled}
                onClick={() => handleEarlyClose(popup.id)}
              >
                조기 종료
              </button>

              <button
                className={styles.cancel}
                disabled={isDisabled}
                onClick={() => handleCancel(popup.id)}
              >
                운영 취소
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
