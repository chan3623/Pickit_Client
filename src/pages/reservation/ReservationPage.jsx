import ReservationConfirm from "../../components/reservation/ReservationConfirm";
import styles from "./ReservationPage.module.css";

export default function ReservationPage() {
  return (
    <div className={styles.page}>
        <ReservationConfirm/>
    </div>
  );
}
