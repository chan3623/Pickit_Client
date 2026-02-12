import {
  getPopupReservation,
  postPopupReservation,
} from "@/services/popup.api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Reservation from "../../components/reservation/Reservation";
import { showError, showSuccess } from "../../lib/swal";
import styles from "./ReservationPage.module.css";

export default function ReservationPage() {
  const location = useLocation();

  const popupId = location.state?.popupId;

  const [data, setDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPopupReservation(popupId);
      if (response.status === 200) {
        setDate(response.data);
        setLoading(false);
      }
    };
    fetchData();
  }, [popupId]);

  const handleSubmitReservation = async (reservationPayload) => {
    try {
      const response = await postPopupReservation(reservationPayload);

      if (response.data && response.status === 201) {
        showSuccess("예약되었습니다.");
        navigate("/home");
      }
    } catch (e) {
      showError(e.customMessage);
    }
  };

  // const handleSubmitReservation = async (reservationPayload) => {
  //   try {
  //     const [res1, res2] = await Promise.all([
  //       postPopupReservation(reservationPayload),
  //       postPopupReservation(reservationPayload),
  //     ]);

  //     console.log("res1:", res1);
  //     console.log("res2:", res2);

  //     showSuccess("예약되었습니다.");
  //     navigate("/home");
  //   } catch (e) {
  //     console.error("동시 요청 중 하나 실패", e);
  //     showError(e.customMessage);
  //   }
  // };

  if (loading) return <div>로딩중...</div>;

  return (
    <div className={styles.page}>
      <Reservation data={data} onSubmitReservation={handleSubmitReservation} />
    </div>
  );
}
