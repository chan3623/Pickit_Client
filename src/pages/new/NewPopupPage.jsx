import InsertPopup from "@/components/new/InsertPopup";
import styles from "./NewPopupPage.module.css";

export default function PopupCreatePage() {
  return (
    <div className={styles.page}>
      <InsertPopup />
    </div>
  );
}
