import { UserAuthContext } from "@/auth/user/UserAuthContext";
import LoginModal from "@/components/common/login/LoginModal";
import SignupModal from "@/components/common/signup/SignupModal";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function DetailInfo({ data }) {
  const { account } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleMoveReservation = async () => {
    if (!account) {
      setShowLoginModal(true);
      return;
    }

    navigate("/reservation", {
      state: {
        popupId: data.id,
      },
    });
  };

  const handleSignupOpen = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const isDisabled = data.status !== "ACTIVE";

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
        disabled={isDisabled}
        onClick={handleMoveReservation}
      >
        {data.status === "ACTIVE"
          ? "예약하러 가기"
          : data.status === "EARLY_CLOSED"
            ? "해당 팝업스토어의 예약이 조기마감 되었습니다"
            : "해당 팝업스토어는 운영이 취소 되었습니다"}
      </button>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignupClick={handleSignupOpen}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </div>
  );
}
