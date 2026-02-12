import styles from "./NewPopupPage.module.css";
import InsertPopup from "@/components/new/InsertPopup";
import { ENV } from "@/config/env";

export default function PopupCreatePage() {
  return (
    <div className={styles.page}>
      <InsertPopup/>
    </div>
  )
}
