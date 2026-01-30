import DefaultInfo from "@/components/detail/DefaultInfo";
import DetailInfo from "@/components/detail/DetailInfo";
import styles from "./DetailPage.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <DefaultInfo />
      {/* <DetailInfo /> */}
    </div>
  );
}
