// PopupAdminPage.jsx
import { useEffect, useState } from "react";
import styles from "./ManagerPage.module.css";
import ManagerList from "@/components/manager/ManagerList";
import { getManagerPopups } from "@/services/popup.api";
import { useNavigate } from "react-router-dom";

export default function PopupAdminPage() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopups = async () => {
      const res = await getManagerPopups();
      if (res.status === 200) {
        setPopups(res.data);
      }
      setLoading(false);
    };
    fetchPopups();
  }, []);

  const handleMoveInsert = () => {
    navigate("/new")
  }

  if (loading) {
    return <div className={styles.page}>로딩중...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>팝업스토어 관리</h1>
        <button className={styles.createBtn} onClick={handleMoveInsert}>팝업스토어 등록</button>
      </div>

      <ManagerList popups={popups} />
    </div>
  );
}
