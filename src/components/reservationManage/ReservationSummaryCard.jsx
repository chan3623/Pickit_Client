import styles from "./ReservationManage.module.css";

export default function ReservationSummaryCard({ title, value }) {
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      <h2 className={styles.cardValue}>{value}</h2>
    </div>
  );
}
