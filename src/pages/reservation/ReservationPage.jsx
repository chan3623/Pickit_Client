import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Reservation from "../../components/reservation/Reservation";
import styles from "./ReservationPage.module.css";
import { getPopupReservation, postPopupReservation } from "@/services/reservation.api";
import { showSuccess } from "../../utils/swal";

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
    const response = await postPopupReservation(reservationPayload)

    if(response.data && response.status === 201){
      showSuccess('예약되었습니다.');
      
      navigate('/home')
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div className={styles.page}>
      <Reservation data={data} onSubmitReservation={handleSubmitReservation}/>
    </div>
  );
}
