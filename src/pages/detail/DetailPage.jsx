import DefaultInfo from "@/components/detail/DefaultInfo";
import DetailInfo from "@/components/detail/DetailInfo";
import Reservation from "@/components/detail/Reservation";
import styles from "./DetailPage.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <DefaultInfo />
      <DetailInfo />
      <Reservation/>
    </div>
  );
}
