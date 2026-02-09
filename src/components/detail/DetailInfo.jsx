import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/auth/AuthContext";
import { useContext, useState } from "react";
import LoginModal from "@/components/common/LoginModal";
import style from "./DetailInfo.module.css";

const formatPhoneNumber = (tel) => {
  if (!tel) return "";

  const onlyNumber = tel.replace(/\D/g, "");

  if (onlyNumber.length === 11) {
    return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  if (onlyNumber.length === 10) {
    return onlyNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return tel;
};

export default function DetailInfo({data}) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleMoveReservation = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    navigate("/reservation", {
      state: {
        popupId: data.id,
      },
    });
  };

  return (
    <div className={style.detailBox}>
      <div className={style.titleInnerBox}>
        <h2>팝업스토어 소개</h2>

        <div className={style.telInnerBox}>
          <p>* 문의사항</p>
          <p>{formatPhoneNumber(data.tel)}</p>
        </div>
      </div>

      <div className={style.textBox}>{data.description}</div>

      <button
        className={style.moveBtn}
        onClick={handleMoveReservation}
      >
        예약하러 가기
      </button>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
