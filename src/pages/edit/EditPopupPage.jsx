import UpdatePopup from "@/components/edit/UpdatePopup";
import { getPopupDetail } from "@/services/popup.api.js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./EditPopupPage.module.css";

export default function PopupCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const popupId = location.state?.popupId;

  useEffect(() => {
    if (!popupId) {
      navigate("/manager");
      return;
    }
    const fetchPopupDetail = async () => {
      const response = await getPopupDetail(popupId);

      if (response.status === 200) {
        setData(response.data);
      }
    };

    fetchPopupDetail();
  }, [popupId]);

  return (
    <div className={styles.page}>
      {data && <UpdatePopup popupData={data} />}
    </div>
  );
}
