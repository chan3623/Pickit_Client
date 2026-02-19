import MyReservationList from "@/components/myreservation/MyReservationList";
import { getUserReservations } from "@/services/popup.api";
import { useEffect, useState } from "react";
import styles from "./MyReservationPage.module.css";

export default function MyReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        const response = await getUserReservations();
        if (response.status === 200) {
          setReservations(response.data);
        } else {
          setError("예약 정보를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("예약 정보를 불러오는 중 오류가 발생했습니다.");
        console.error("Error fetching user reservations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserReservations();
  }, []);

  if (loading) {
    return <div className={styles.page}>로딩중...</div>;
  }

  if (error) {
    return (
      <div className={styles.page} style={{ color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <MyReservationList reservations={reservations} />
    </div>
  );
}
