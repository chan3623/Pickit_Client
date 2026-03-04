import { getReservationManage } from "@/services/popup.api.js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReservationManage from "../../components/reservationManage/ReservationManage";
import styles from "./ReservationManagePage.module.css";

const today = new Date().toISOString().split("T")[0];

export default function ReservationManagePage() {
  const [data, setData] = useState(null);
  const location = useLocation();
  const popupId = location.state?.popupId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!popupId) {
      navigate("/manager");
      return;
    }

    const fetchPopupDetail = async () => {
      const filters = { date: today };
      const response = await getReservationManage(popupId, filters);

      if (response.status === 200) {
        setData(response.data);
      } else {
        setData([]);
      }
    };

    fetchPopupDetail();
  }, [popupId]);

  const dateChange = async (date, filters) => {
    const email = filters.searchType === "email" ? filters.keyword : "";
    const phone = filters.searchType === "phone" ? filters.keyword : "";

    const searchOptions = {
      date,
      status: filters.status,
      email,
      phone,
    };
    const response = await getReservationManage(popupId, searchOptions);

    if (response.status === 200) {
      setData(response.data);
    } else {
      setData([]);
    }
  };

  if (!data) return;

  return (
    <div className={styles.page}>
      <ReservationManage data={data} dateChange={dateChange} />
    </div>
  );
}
