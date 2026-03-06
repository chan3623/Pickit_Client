// PopupAdminPage.jsx
import { ManagerAuthContext } from "@/auth/manager/ManagerAuthContext";
import ManagerLoginModal from "@/components/common/login/ManagerLoginModal";
import ManagerSignModal from "@/components/common/signup/ManagerSignupModal";
import ManagerList from "@/components/manager/ManagerList";
import { getManagerPopups } from "@/services/popup.api";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerPage.module.css";

export default function PopupAdminPage() {
  const { account } = useContext(ManagerAuthContext);
  const [popups, setPopups] = useState([]);
  const [showManagerLoginModal, setShowManagerLoginModal] = useState(false);
  const [showManagerSignModal, setShowManagerSignModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopups = async () => {
      if (!account) {
        setPopups([]);
        return;
      }

      const res = await getManagerPopups();

      if (res.success) {
        setPopups(res.data);
      } else {
        setPopups([]);
      }
    };

    fetchPopups();
  }, [account]);

  const updatePopupStatus = (popupId, status) => {
    setPopups((prev) =>
      prev.map((popup) =>
        popup.id === popupId ? { ...popup, status } : popup,
      ),
    );
  };

  const handleMoveInsert = () => {
    if (!account) {
      setShowManagerLoginModal(true);
    } else {
      navigate("/new");
    }
  };

  const handleSignupOpen = () => {
    setShowManagerLoginModal(false);
    setShowManagerSignModal(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>팝업스토어 관리</h1>
        <button className={styles.createBtn} onClick={handleMoveInsert}>
          팝업스토어 등록
        </button>
      </div>

      <ManagerList popups={popups} onStatusChange={updatePopupStatus} />
      <ManagerLoginModal
        isOpen={showManagerLoginModal}
        onClose={() => setShowManagerLoginModal(false)}
        onSignupClick={handleSignupOpen}
      />
      <ManagerSignModal
        isOpen={showManagerSignModal}
        onClose={() => setShowManagerSignModal(false)}
      />
    </div>
  );
}
