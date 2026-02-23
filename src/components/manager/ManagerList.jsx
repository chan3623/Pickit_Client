// ManagerList.jsx

import { useNavigate } from "react-router-dom";
import { ENV } from "../../config/env";
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

export default function ManagerList({ popups }) {
  const navigate = useNavigate();

  const handleMovieEdit = (popupId) => {
    navigate("/edit", {
      state: {
        popupId,
      },
    });
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
                  {active ? "운영중" : "종료"}
                </span>
              </div>

              <div className={styles.period}>
                {formatDate(popup.startDate)} ~ {formatDate(popup.endDate)}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.manage}>예약관리</button>
              <button
                className={styles.edit}
                onClick={() => {
                  handleMovieEdit(popup.id);
                }}
              >
                수정
              </button>
              <button className={styles.delete}>삭제</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
