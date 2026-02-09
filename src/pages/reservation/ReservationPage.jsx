import Reservation from "../../components/reservation/Reservation";
import styles from "./ReservationPage.module.css";

export default function ReservationPage() {
  return (
    <div className={styles.page}>
      <Reservation />
    </div>
  );
}
